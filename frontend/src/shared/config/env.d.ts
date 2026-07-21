/**
 * Vite 环境变量类型声明。
 *
 * 新增环境变量时在此处扩展接口，
 * 页面和组件中禁止直接使用 import.meta.env。
 */
/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API 基础路径，默认 '/api' */
  readonly VITE_API_BASE_URL: string;
  /** 是否启用 MSW Mock，默认 'false' */
  readonly VITE_ENABLE_MOCK: string;
  /** 应用标题，默认 '瑜悦练' */
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
