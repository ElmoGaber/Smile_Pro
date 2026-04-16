import { existsSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';
import { createRequire } from 'module';

const currentFile = fileURLToPath(import.meta.url);
const scriptsDir = path.dirname(currentFile);
const workspaceRoot = path.resolve(scriptsDir, '..');
const storeDir = path.join(workspaceRoot, 'node_modules', '.pnpm');
const require = createRequire(currentFile);

function toPnpmPrefix(packageName) {
  return packageName.replace('/', '+');
}

function resolveBin(packageName, binPath) {
  const prefix = `${toPnpmPrefix(packageName)}@`;
  const candidates = readdirSync(storeDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith(prefix))
    .map((entry) => path.join(storeDir, entry.name, 'node_modules', packageName, binPath))
    .filter((candidate) => existsSync(candidate));

  if (candidates.length === 0) {
    throw new Error(`Unable to resolve ${packageName}/${binPath} from ${storeDir}`);
  }

  return candidates[0];
}

function buildNodePath(resolvedBin) {
  const packageDir = path.dirname(path.dirname(resolvedBin));
  const storeNodeModules = path.join(storeDir, 'node_modules');
  const paths = [path.join(packageDir, 'node_modules'), packageDir, storeNodeModules];

  if (process.env.NODE_PATH) {
    paths.push(process.env.NODE_PATH);
  }

  return paths.join(path.delimiter);
}

const [packageName, binPath, ...args] = process.argv.slice(2);

if (!packageName || !binPath) {
  console.error('Usage: node scripts/run-pnpm-bin.mjs <package-name> <bin-path> [args...]');
  process.exit(1);
}

let resolvedBin;

try {
  resolvedBin = resolveBin(packageName, binPath);
} catch {
  resolvedBin = require.resolve(`${packageName}/${binPath}`);
}

const result = spawnSync(process.execPath, [resolvedBin, ...args], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_PATH: buildNodePath(resolvedBin),
  },
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 1);