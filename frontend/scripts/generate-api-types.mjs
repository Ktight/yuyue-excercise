/**
 * 使用 openapi-typescript 从后端契约生成完整类型。
 * 契约缺失时只生成显式占位，业务模块不得据此宣称契约就绪。
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import openapiTS, { astToString } from 'openapi-typescript';
import { format, resolveConfig } from 'prettier';

const ROOT = resolve(import.meta.dirname, '..');
const INPUT = resolve(ROOT, '..', 'contracts', 'openapi.yaml');
const OUTPUT_DIR = resolve(ROOT, 'src', 'generated');
const OUTPUT = resolve(OUTPUT_DIR, 'api-types.ts');
const HEADER = `// AUTO-GENERATED — DO NOT EDIT\n// Source: contracts/openapi.yaml\n`;
const PRETTIER_OPTIONS = { ...(await resolveConfig(OUTPUT)), parser: 'typescript' };

mkdirSync(OUTPUT_DIR, { recursive: true });

if (!existsSync(INPUT)) {
  const placeholder = await format(
    `${HEADER}\n/** CONTRACT_MISSING: contracts/openapi.yaml 尚未提供。 */\nexport type paths = Record<string, never>;\nexport type components = Record<string, never>;\n`,
    PRETTIER_OPTIONS,
  );
  writeFileSync(OUTPUT, placeholder, 'utf8');
  console.warn('⚠ contracts/openapi.yaml 不存在；已生成 CONTRACT_MISSING 占位。');
  process.exit(0);
}

try {
  const ast = await openapiTS(pathToFileURL(INPUT));
  const output = await format(`${HEADER}\n${astToString(ast)}`, PRETTIER_OPTIONS);
  writeFileSync(OUTPUT, output, 'utf8');
  console.log(`✓ API 类型已生成：${OUTPUT}`);
} catch (error) {
  console.error('✗ OpenAPI 类型生成失败。契约未通过校验。', error);
  process.exit(1);
}
