import 'vue-router';
import type { UserRole } from '@/features/auth';

declare module 'vue-router' {
  interface RouteMeta {
    guest?: boolean;
    roles?: readonly UserRole[];
  }
}

export {};
