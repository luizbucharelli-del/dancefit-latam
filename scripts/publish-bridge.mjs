// Windows ConPTY compatibility: keep the official Sites workflow on piped
// handles so its nested packaging process can inherit valid standard streams.
// Credentials pass only through memory/stdin and are never logged or saved.
import { spawn } from 'node:child_process';
const [workflow, ...args] = process.argv.slice(2);
if (!workflow) throw new Error('Specify the official workflow script.');
process.stderr.write('Ready for Site workflow JSON on stdin (input is hidden).\n');
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
let input = '';
process.stdin.on('data', function receive(chunk) {
  input += chunk;
  if (input.includes('\u0003') || input.length > 65536) process.exit(1);
  if (!/[\r\n]/.test(input)) return;
  process.stdin.removeListener('data', receive);
  if (process.stdin.isTTY) process.stdin.setRawMode(false);
  process.stdin.pause();
  const child = spawn(process.execPath, [workflow, ...args], { cwd: process.cwd(), env: process.env, stdio: ['pipe', 'pipe', 'pipe'] });
  child.stdout.on('data', data => process.stdout.write(data));
  child.stderr.on('data', data => process.stderr.write(data));
  child.on('error', () => { process.stderr.write('Workflow process could not start.\n'); process.exitCode = 1; });
  child.on('close', code => { process.exitCode = code ?? 1; });
  child.stdin.end(input.trim() + '\n');
  input = '';
});
