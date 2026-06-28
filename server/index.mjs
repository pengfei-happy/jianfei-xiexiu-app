import cors from 'cors';
import 'dotenv/config';
import express from 'express';

const app = express();
const port = Number(process.env.PORT || 8787);
const apiKey = process.env.DASHSCOPE_API_KEY;

app.use(cors());
app.use(express.json({ limit: '12mb' }));

app.get('/api/health', (_request, response) => {
  response.json({ ok: true, model: 'qwen-vl-plus', configured: Boolean(apiKey) });
});

app.post('/api/recognize-food', async (request, response) => {
  if (!apiKey) {
    response.status(503).json({ error: 'DASHSCOPE_API_KEY 未配置' });
    return;
  }

  const { imageBase64, mimeType = 'image/jpeg' } = request.body ?? {};
  if (!imageBase64 || typeof imageBase64 !== 'string') {
    response.status(400).json({ error: '缺少图片数据' });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const upstream = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'qwen-vl-plus',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
            {
              type: 'text',
              text: `识别图片中的整道餐食。只输出 JSON，不要 markdown。格式：
{"dishName":"菜名","estimatedCalories":数字,"confidence":0到1,"items":[{"name":"食材名","grams":数字,"calories":数字,"emoji":"一个合适emoji"}]}
要求：按肉眼可见份量估算；复杂菜肴保持为一道菜，但 items 拆出主要组成；总热量与各项之和一致；若看不出食物，dishName 写“未识别到食物”且 confidence 小于 0.3。`,
            },
          ],
        }],
      }),
    });

    const payload = await upstream.json();
    if (!upstream.ok) {
      response.status(upstream.status).json({ error: payload?.error?.message || '视觉模型调用失败' });
      return;
    }

    const raw = payload?.choices?.[0]?.message?.content;
    const parsed = typeof raw === 'string' ? JSON.parse(raw.replace(/^```json\s*|\s*```$/g, '')) : raw;
    const normalized = normalizeResult(parsed);
    response.json(normalized);
  } catch (error) {
    const message = error?.name === 'AbortError' ? '识别超时，请重试' : '识别结果格式异常';
    response.status(502).json({ error: message });
  } finally {
    clearTimeout(timeout);
  }
});

function normalizeResult(value) {
  if (!value || typeof value.dishName !== 'string' || !Array.isArray(value.items)) {
    throw new Error('invalid result');
  }
  const items = value.items.slice(0, 10).map((item, index) => ({
    id: `ai-${index}-${Date.now()}`,
    name: String(item.name || `食材 ${index + 1}`),
    grams: Math.max(1, Math.round(Number(item.grams) || 1)),
    calories: Math.max(0, Math.round(Number(item.calories) || 0)),
    emoji: String(item.emoji || '🍽️').slice(0, 4),
  }));
  const itemCalories = items.reduce((sum, item) => sum + item.calories, 0);
  return {
    dishName: value.dishName.trim().slice(0, 40),
    estimatedCalories: itemCalories || Math.max(0, Math.round(Number(value.estimatedCalories) || 0)),
    confidence: Math.min(1, Math.max(0, Number(value.confidence) || 0)),
    items,
  };
}

app.listen(port, () => {
  console.log(`Food recognition API: http://localhost:${port}`);
});
