/** 从 contracts/enums.json 生成值常量、联合类型和显示标签。 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { format, resolveConfig } from 'prettier';

const ROOT = resolve(import.meta.dirname, '..');
const INPUT = resolve(ROOT, '..', 'contracts', 'enums.json');
const OUTPUT_DIR = resolve(ROOT, 'src', 'generated');
const OUTPUT = resolve(OUTPUT_DIR, 'enums.ts');
const HEADER = `// AUTO-GENERATED — DO NOT EDIT\n// Source: contracts/enums.json\n`;
const PRETTIER_OPTIONS = { ...(await resolveConfig(OUTPUT)), parser: 'typescript' };

mkdirSync(OUTPUT_DIR, { recursive: true });

if (!existsSync(INPUT)) {
  const placeholder = await format(
    `${HEADER}\n/** CONTRACT_MISSING: contracts/enums.json 尚未提供。 */\nexport {};\n`,
    PRETTIER_OPTIONS,
  );
  writeFileSync(OUTPUT, placeholder, 'utf8');
  console.warn('⚠ contracts/enums.json 不存在；已生成 CONTRACT_MISSING 占位。');
  process.exit(0);
}

try {
  const source = JSON.parse(readFileSync(INPUT, 'utf8'));
  if (!source || Array.isArray(source) || typeof source !== 'object') {
    throw new Error('根节点必须是对象。');
  }

  const lines = [HEADER];
  for (const [groupName, definition] of Object.entries(source)) {
    const constantName = toConstantName(groupName);
    const typeName = toPascalCase(groupName);

    if (Array.isArray(definition)) {
      if (!definition.every((value) => typeof value === 'string')) {
        throw new Error(`${groupName} 数组只能包含字符串。`);
      }
      lines.push(`export const ${constantName} = ${JSON.stringify(definition)} as const;`);
      lines.push(`export type ${typeName} = (typeof ${constantName})[number];`, '');
      continue;
    }

    if (!definition || typeof definition !== 'object') {
      throw new Error(`${groupName} 必须是字符串数组或 { value: label } 对象。`);
    }

    const entries = Object.entries(definition);
    if (!entries.every(([, label]) => typeof label === 'string')) {
      throw new Error(`${groupName} 的标签必须是字符串。`);
    }

    lines.push(`export const ${constantName} = {`);
    for (const [value] of entries) {
      lines.push(`  ${toConstantName(value)}: ${JSON.stringify(value)},`);
    }
    lines.push('} as const;');
    lines.push(`export type ${typeName} = (typeof ${constantName})[keyof typeof ${constantName}];`);
    lines.push(`export const ${constantName}_LABELS: Readonly<Record<${typeName}, string>> = {`);
    for (const [value, label] of entries) {
      lines.push(`  ${JSON.stringify(value)}: ${JSON.stringify(label)},`);
    }
    lines.push('};', '');
  }

  const output = await format(lines.join('\n'), PRETTIER_OPTIONS);
  writeFileSync(OUTPUT, output, 'utf8');
  console.log(`✓ 枚举已生成：${OUTPUT}`);
} catch (error) {
  console.error('✗ 枚举生成失败。', error);
  process.exit(1);
}

function toConstantName(value) {
  const result = value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();
  if (!result || /^\d/.test(result)) throw new Error(`无法生成合法标识符：${value}`);
  return result;
}

function toPascalCase(value) {
  const words = value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[^a-zA-Z0-9]+/);
  const result = words
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join('');
  if (!result || /^\d/.test(result)) throw new Error(`无法生成合法类型名：${value}`);
  return result;
}
