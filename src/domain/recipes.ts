import { PlanType, RecipeDay, RecipeMeal } from './types';

export const QIN_HAO_TOTAL_TARGET_LOSS_JIN = 11.3;
export const DABING_WEIGHT_LOSS_TEXT = '大冰循环以稳步减脂、维稳塑形为主';

export const qinHaoRecipes: RecipeDay[] = [
  qin(1, 'rapid_loss', '纯半液断日', 1.6, '全天主要以无糖液体；饿了可喝温水、无糖气泡水', ['无糖纯豆浆500ml+麦满分一个', '黑咖啡500ml/东方树叶茉莉花茶', '东方树叶茉莉花茶/汤 二选一']),
  qin(2, 'rapid_loss', '全天玉米日', 1.5, '全天仅水煮玉米，三餐定量，无其他食物', ['水煮玉米1根', '水煮玉米1根', '水煮玉米1根']),
  qin(3, 'rapid_loss', '低糖水果日', 1.2, '仅吃指定三款低糖水果，不混吃其他水果', ['火龙果1个', '苹果1个', '蓝莓1小盒100g']),
  qin(4, 'rapid_loss', '纯鸡蛋高蛋白日', 1.3, '全天只吃水煮鸡蛋，无主食、无蔬果、无油无盐', ['水煮鸡蛋2个', '水煮鸡蛋3个', '水煮鸡蛋2个']),
  qin(5, 'rapid_loss', '纯蔬菜清肠日', 1.0, '指定三种绿叶菜，清水水煮、无油无盐', ['水煮生菜200g', '水煮菠菜200g', '水煮西兰花200g']),
  qin(6, 'refeed_stabilize', '轻蛋白蔬果日', 0.9, '复食巩固', ['水煮蛋2个 + 小番茄10颗', '清蒸鸡胸肉100g + 水煮油麦菜200g', '黄瓜1根 + 0脂无糖酸奶200ml']),
  qin(7, 'refeed_stabilize', '低脂纯素日', 0.8, '晚餐极简，持续控热量', ['纯牛奶300ml + 圣女果适量', '水煮娃娃菜250g + 去皮低盐鸡腿1个', '喝汤或不吃']),
  qin(8, 'refeed_stabilize', '高蛋白塑形日', 0.8, '复食巩固', ['0脂无糖酸奶250ml', '水煮瘦牛肉80g + 水煮秋葵200g', '喝汤或不吃或青菜']),
  qin(9, 'refeed_stabilize', '清淡控卡日', 0.7, '外卖轻食可控，掉秤平稳', ['拿铁 + 水煮蛋1个', '蔬菜沙拉点外卖', '喝汤或不吃']),
  qin(10, 'refeed_stabilize', '生日放纵餐日', 0, '不暴饮暴食，以喝饱为主、浅尝解馋', ['正常清淡吃，鸡蛋/牛奶/杂粮任选，七分饱', '生日正餐放纵餐，少油优先，每样浅尝，七分饱', '小块生日蛋糕许愿解馋，适量食用']),
  qin(11, 'refeed_stabilize', '粗粮复食日', 0.6, '放纵后回正轨', ['蒸紫薯100g + 无糖豆浆300ml', '清汤荞麦面小碗 + 青菜 + 水煮鸡胸肉80g', '苹果1个/喝汤或不吃']),
  qin(12, 'refeed_stabilize', '均衡塑形日', 0.6, '复食巩固', ['全麦面包1片 + 水煮蛋1个 + 黑咖啡', '蒸山药100g + 水煮西兰花 + 瘦牛肉80g', '苹果1个/喝汤或不吃']),
  qin(13, 'refeed_stabilize', '稳体重减脂日', 0.5, '稳体重减脂', ['玉米半根 + 纯牛奶250ml', '杂粮饭小半碗 + 白灼菜心 + 去皮鸡腿肉100g', '苹果1个/喝汤或不吃']),
  qin(14, 'refeed_stabilize', '精细控卡日', 0.5, '精细控卡', ['水煮蛋2个 + 小番茄10颗', '荞麦饭小半碗 + 清蒸鱼肉120g + 水煮生菜', '喝汤或不吃']),
  qin(15, 'refeed_stabilize', '完美过渡维稳日', 0.4, '过渡期正常吃饭，微调维稳', ['全麦面包1片 + 纯牛奶 + 水煮蛋1个', '少油家常菜2道 + 半碗白米饭', '喝汤或不吃']),
];

export const dabingRecipes: RecipeDay[] = [
  dabing(1, '大冰循环第1天', '清淡启动、适配过渡', ['水煮鸡蛋2个 + 蒸玉米半根 + 纯牛奶250ml', '杂粮饭小半碗 + 清炒瘦肉（少油） + 白灼青菜（七分饱）', '番茄鸡蛋汤1大碗']),
  dabing(2, '大冰循环第2天', '高蛋白低脂、清肠减负', ['无糖豆浆300ml + 蒸紫薯100g + 小番茄若干', '清汤荞麦面小碗 + 水煮鸡胸肉 + 绿叶青菜', '紫菜蛋花汤1大碗 + 凉拌黄瓜少量']),
  dabing(3, '大冰循环第3天', '低卡控脂、平稳代谢', ['无糖黑咖啡 + 水煮蛋1个 + 全麦面包1片', '杂粮饭小半碗 + 清蒸鸡胸肉 + 清炒油麦菜', '冬瓜清汤1大碗']),
  dabing(4, '大冰循环第4天', '高蛋白补给、紧致塑形', ['纯牛奶250ml + 水煮蛋2个 + 少量低糖水果', '蒸山药100g + 瘦牛肉片炒青菜（少油）', '青菜豆腐汤1大碗']),
  dabing(5, '大冰循环第5天', '家常清淡、灵活控卡', ['无糖豆浆300ml + 玉米半根', '家常少油正餐，荤素搭配，七分饱，不暴食', '番茄清汤1大碗 + 凉拌生菜']),
  dabing(6, '大冰循环第6天', '粗粮维稳、持续燃脂', ['纯牛奶 + 水煮蛋1个 + 蒸红薯小块', '杂粮饭 + 去皮鸡腿肉 + 白灼菜心', '菌菇清汤1大碗']),
  dabing(7, '大冰循环第7天', '清淡收尾、调理肠胃、稳固体重', ['0脂无糖酸奶 + 全麦面包1片 + 小番茄', '正常家常少油餐，七分饱', '混合蔬菜清汤1大碗']),
];

export function getExecutionDay(startDate: string, targetDate: string): number {
  const start = parseLocalDate(startDate);
  const target = parseLocalDate(targetDate);
  const diffDays = Math.floor((target.getTime() - start.getTime()) / 86_400_000);
  return Math.max(diffDays + 1, 1);
}

export function getRecipeByDay(planType: PlanType, day: number): RecipeDay | undefined {
  if (planType === 'qin_hao_15') return qinHaoRecipes.find((recipe) => recipe.day === day);
  const cycleDay = ((Math.max(day, 1) - 1) % 7) + 1;
  return dabingRecipes.find((recipe) => recipe.cycleDay === cycleDay);
}

export function getRecipeForExecutionDay(planType: PlanType, executionDay: number): RecipeDay | undefined {
  return getRecipeByDay(planType, executionDay);
}

function qin(day: number, phase: 'rapid_loss' | 'refeed_stabilize', stageName: string, estimatedWeightLossJin: number, coreRule: string, meals: string[]): RecipeDay {
  return {
    id: `qin-hao-${day}`,
    planType: 'qin_hao_15',
    day,
    phase,
    stageName,
    estimatedWeightLossJin,
    meals: makeMeals(meals),
    coreRule,
    warnings: ['无油少盐、无糖、无酱料；杜绝零食、奶茶、油炸、夜宵、酒精、精加工食品'],
    sourceLocked: true,
  };
}

function dabing(cycleDay: number, stageName: string, principle: string, meals: string[]): RecipeDay {
  return {
    id: `dabing-${cycleDay}`,
    planType: 'dabing_7_cycle',
    day: cycleDay,
    cycleDay,
    phase: 'dabing_cycle',
    stageName,
    estimatedWeightLossText: DABING_WEIGHT_LOSS_TEXT,
    meals: makeMeals(meals),
    coreRule: '16:8轻断食：每日进食窗口固定10:00-18:00；进食顺序为先喝汤，再吃蔬菜，再吃肉，最后吃主食；每日饮水2000ml',
    principle,
    warnings: ['18点后仅饮用温水、无糖茶、黑咖啡，不再进食；不喝含糖饮品，不吃夜宵，不强行光盘'],
    sourceLocked: true,
  };
}

function makeMeals(contents: string[]): RecipeMeal[] {
  const labels: Array<[RecipeMeal['type'], string]> = [
    ['breakfast', '早餐'],
    ['lunch', '午餐'],
    ['dinner', '晚餐'],
  ];
  return contents.map((content, index) => ({
    type: labels[index][0],
    label: labels[index][1],
    content,
    isProvidedBySource: true,
  }));
}

function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}
