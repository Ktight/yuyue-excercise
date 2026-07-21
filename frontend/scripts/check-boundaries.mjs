/**
 * 模块依赖边界检查脚本。
 *
 * 验证规则：
 *   1. shared/ 不得依赖 features/
 *   2. features/ 之间只能通过 index.ts 导入
 *   3. layouts/ 不得导入 features/
 *   4. app/ 不得导入 features/（router 与 mock 装配入口除外）
 *
 * 运行：node scripts/check-boundaries.mjs
 * 退出码：0 = 全部通过，1 = 存在违规
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const SRC = join(ROOT, 'src');

function normalizePath(value) {
  return value.replace(/\\/g, '/');
}

function toSourceRelative(filePath) {
  if (!filePath) return '';
  if (!resolve(filePath).startsWith(resolve(SRC))) return normalizePath(filePath);
  return normalizePath(relative(SRC, filePath));
}

// 收集所有源文件
const sourceFiles = [];
function collectFiles(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', '.git'].includes(entry.name)) {
        collectFiles(full);
      }
    } else if (/\.(ts|tsx|vue|mjs)$/.test(entry.name)) {
      sourceFiles.push(full);
    }
  }
}
collectFiles(SRC);

// 提取文件中的 import 语句
function extractImports(content) {
  const source = content.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const imports = [];
  const regex = /(?:from\s+|import\s*\()['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

// 解析 import 路径到 src/ 相对路径
function resolveImport(filePath, importPath) {
  if (importPath.startsWith('@/')) {
    return importPath.slice(2); // e.g. 'shared/api' or 'features/auth'
  }
  if (importPath.startsWith('.')) {
    const fileDir = toSourceRelative(filePath).split('/').slice(0, -1).join('/');
    const parts = fileDir ? fileDir.split('/') : [];
    const importParts = importPath.split('/');
    for (const part of importParts) {
      if (part === '..') {
        if (parts.length > 0) parts.pop();
      } else if (part !== '.') {
        parts.push(part);
      }
    }
    return parts.join('/');
  }
  return null; // node_modules import
}

// 判断文件属于哪个层
function getLayer(filePath) {
  const rel = toSourceRelative(filePath);
  if (rel.startsWith('shared/')) return 'shared';
  if (rel.startsWith('features/')) return 'features';
  if (rel.startsWith('layouts/')) return 'layouts';
  if (rel.startsWith('app/')) return 'app';
  if (rel.startsWith('generated/')) return 'generated';
  return null;
}

function getFeatureName(filePath) {
  const rel = toSourceRelative(filePath);
  if (rel.startsWith('features/')) {
    return rel.split('/')[1]; // e.g. 'auth', 'schedules'
  }
  return null;
}

// ---------------------------------------------------------------------------
// 主检查逻辑
// ---------------------------------------------------------------------------
const violations = [];

for (const file of sourceFiles) {
  const fileRel = toSourceRelative(file);
  const layer = getLayer(file);
  const feature = getFeatureName(file);
  const content = readFileSync(file, 'utf-8');
  const imports = extractImports(content);

  for (const imp of imports) {
    const resolved = resolveImport(file, imp);
    if (!resolved) continue; // node_modules

    const targetLayer = getLayer(resolved);
    const targetFeature = getFeatureName(resolved);

    // ---- Rule 1: shared 不得依赖 features ----
    if (layer === 'shared' && targetLayer === 'features') {
      violations.push(`[shared→features] ${fileRel} 导入了 features 模块：${imp}`);
    }

    // ---- Rule 2: features 之间只能通过 index.ts 导入 ----
    if (
      layer === 'features' &&
      targetLayer === 'features' &&
      feature &&
      targetFeature &&
      feature !== targetFeature
    ) {
      // 允许通过其他 feature 的 index.ts 导入
      const importFileBase = basename(resolved, extname(resolved));
      const isIndexImport = importFileBase === 'index' || resolved.endsWith('/index.ts');
      const isDirectIndex = resolved === `features/${targetFeature}/index`;
      // 检查是否从 features/other-feature/ 直接导入（而非 features/other-feature/index）
      const parts = resolved.split('/');
      if (parts.length > 2 && !isIndexImport && !isDirectIndex) {
        violations.push(
          `[features→features] ${fileRel} 从 ${targetFeature} 深层导入：${imp}（应改为 '@/features/${targetFeature}'）`,
        );
      }
    }

    // ---- Rule 3: layouts 不得导入 features ----
    if (layer === 'layouts' && targetLayer === 'features') {
      violations.push(`[layouts→features] ${fileRel} 导入了 features 模块：${imp}`);
    }

    // ---- Rule 4: app 不得导入 features（router 与 mock 装配入口除外） ----
    if (
      layer === 'app' &&
      targetLayer === 'features' &&
      !fileRel.startsWith('app/router/') &&
      !fileRel.startsWith('app/mocks/')
    ) {
      violations.push(`[app→features] ${fileRel} 导入了 features 模块：${imp}`);
    }
  }
}

// ---------------------------------------------------------------------------
// 输出结果
// ---------------------------------------------------------------------------
console.log(`检查 ${sourceFiles.length} 个源文件...`);

if (violations.length === 0) {
  console.log('✓ 模块边界检查通过，未发现违规。');
  process.exit(0);
} else {
  console.error(`✗ 发现 ${violations.length} 项模块边界违规：\n`);
  for (const v of violations) {
    console.error(`  ${v}`);
  }
  console.error('');
  process.exit(1);
}
