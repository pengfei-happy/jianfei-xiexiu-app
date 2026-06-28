import { spawn } from 'node:child_process';

const api = spawn('node', ['server/index.mjs'], { stdio: 'inherit' });
const expo = spawn('npx', ['expo', 'start', '--web'], { stdio: 'inherit' });

function stop() {
  api.kill('SIGTERM');
  expo.kill('SIGTERM');
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
