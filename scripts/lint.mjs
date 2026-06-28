import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const roots = ['App.tsx', 'src'];
const sourceExtensions = new Set(['.ts', '.tsx']);
const forbidden = [
  { pattern: /\bTODO\b|\bFIXME\b|NotImplementedError|raise NotImplementedError/i, message: 'remove unfinished markers' },
  { pattern: /今天还可以吃|运动奖励|拍照记录|AI 会先估算/, message: 'remove old calorie-camera product copy' },
];

const failures = [];

for (const file of roots.flatMap(walk)) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, index) => {
    if (/\s+$/.test(line)) failures.push(`${file}:${index + 1} trailing whitespace`);
    if (line.length > 180) failures.push(`${file}:${index + 1} line exceeds 180 characters`);
  });
  for (const rule of forbidden) {
    if (rule.pattern.test(text)) failures.push(`${file}: ${rule.message}`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

function walk(path) {
  const stat = statSync(path);
  if (stat.isFile()) return sourceExtensions.has(extension(path)) ? [path] : [];
  return readdirSync(path).flatMap((entry) => walk(join(path, entry)));
}

function extension(path) {
  const index = path.lastIndexOf('.');
  return index === -1 ? '' : path.slice(index);
}
