import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const testsDir = dirname(fileURLToPath(import.meta.url));
const testFiles = readdirSync(testsDir)
  .filter((f) => f.endsWith('.test.mjs'))
  .sort();

let failures = 0;

for (const file of testFiles) {
  const fullPath = join(testsDir, file);
  const result = spawnSync(process.execPath, [fullPath], { stdio: 'inherit' });
  if (result.status !== 0) {
    failures += 1;
    console.error(`FAILED: ${file}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} of ${testFiles.length} test file(s) failed.`);
  process.exit(1);
} else {
  console.log(`\nAll ${testFiles.length} test files passed.`);
}
