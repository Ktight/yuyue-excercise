/** User API wire-format changes are isolated here. */
import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  UserCreateRequestDto,
  UserDto,
  UserListRequestDto,
  UserListResult,
} from '@/features/users/model/users.types';

type Schemas = components['schemas'];
const mapUser = (user: Schemas['User']): UserDto => ({
  id: user.id,
  name: user.name,
  phone: user.phone,
  role: user.role,
  avatar: user.avatar,
  companyId: user.company_id,
  storeId: user.store_id,
  isActive: user.is_active,
});
export async function fetchUsers(params: UserListRequestDto = {}): Promise<UserListResult> {
  const { data: response } = await httpClient.get<Schemas['UserListSuccessResponse']>('/users/', {
    params,
  });
  return {
    items: response.data.items.map(mapUser),
    page: response.data.page,
    pageSize: response.data.page_size,
    total: response.data.total,
  };
}
export async function createUser(dto: UserCreateRequestDto): Promise<UserDto> {
  const body = {
    phone: dto.phone,
    name: dto.name,
    password: dto.password,
    role: dto.role,
    store_id: dto.storeId ?? null,
    is_active: dto.isActive ?? true,
  } satisfies Schemas['UserCreateRequest'];
  const { data: response } = await httpClient.post<Schemas['UserSuccessResponse']>('/users/', body);
  return mapUser(response.data);
}
