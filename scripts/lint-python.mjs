// Lints and formats staged Python files with Ruff.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const VENV_BINARIES = [
  path.join('backend', '.venv', 'Scripts', 'ruff.exe'),
  path.join('backend', '.venv', 'bin', 'ruff'),
];

// Prefers the project virtualenv so everyone lints with the same Ruff version.
function resolveRuff() {
  return VENV_BINARIES.find((candidate) => existsSync(candidate)) ?? 'ruff';
}

// Blocks the commit when Ruff is missing rather than letting unchecked code through.
function run(ruff, args, files) {
  const result = spawnSync(ruff, [...args, ...files], { stdio: 'inherit', shell: false });
  if (result.error) {
    console.error('\nRuff not found. Run: pip install -r backend/requirements-dev.txt\n');
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status);
  }
}

const files = process.argv.slice(2).map((file) => file.replace(/^"|"$/g, ''));

if (files.length > 0) {
  const ruff = resolveRuff();
  run(ruff, ['check', '--fix'], files);
  run(ruff, ['format'], files);
}
