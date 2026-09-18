// Routes each staged file to the linter that owns its stack.
import path from 'node:path';

const FRONTEND_DIR = path.resolve('frontend');

// ESLint runs from inside the frontend package, so its paths must be relative to it.
const toFrontendPaths = (files) =>
  files.map((file) => `"${path.relative(FRONTEND_DIR, file).split(path.sep).join('/')}"`).join(' ');

const quote = (files) => files.map((file) => `"${file}"`).join(' ');

export default {
  'frontend/**/*.{ts,tsx}': (files) => [
    `npm --prefix frontend run lint:fix -- ${toFrontendPaths(files)}`,
    `prettier --write ${quote(files)}`,
  ],
  '*.{js,cjs,mjs,json,css,html,yml,yaml}': (files) => [`prettier --write ${quote(files)}`],
  'backend/**/*.py': (files) => [`node scripts/lint-python.mjs ${quote(files)}`],
};
