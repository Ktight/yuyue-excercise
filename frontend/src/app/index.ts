/**
 * App 层公开出口。
 * 后续步骤将在此处导出路由、状态等。
 */

// 设计令牌 — 必须在此处导入以确保全局可用
import './styles/tokens.css';

// 通用 UI 原子组件
export { AppLoading, AppEmpty, AppError, AppConfirm, AppPage, AppStatusTag } from './components';

// 路由
export { default as router } from './router';
