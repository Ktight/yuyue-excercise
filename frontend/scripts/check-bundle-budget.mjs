import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, URL } from 'node:url';

const assetsDirectory = fileURLToPath(new URL('../dist/assets/', import.meta.url));
const files = readdirSync(assetsDirectory);
const javascript = files
  .filter((file) => file.endsWith('.js'))
  .map((file) => ({ file, bytes: statSync(join(assetsDirectory, file)).size }));

const largest = javascript.reduce(
  (current, item) => (item.bytes > current.bytes ? item : current),
  { file: '', bytes: 0 },
);
const total = javascript.reduce((sum, item) => sum + item.bytes, 0);
const limits = { largest: 400 * 1024, total: 1200 * 1024 };
const kib = (bytes) => `${(bytes / 1024).toFixed(1)} KiB`;

console.log(`Bundle budget: largest ${largest.file} ${kib(largest.bytes)}, total JS ${kib(total)}`);
if (largest.bytes > limits.largest || total > limits.total) {
  console.error(
    `Bundle budget exceeded: largest <= ${kib(limits.largest)}, total <= ${kib(limits.total)}`,
  );
  process.exitCode = 1;
}
