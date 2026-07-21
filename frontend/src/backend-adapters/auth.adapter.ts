/** Backend paths, wire fields and generated response types are isolated here. */
import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type {
  ChangePasswordRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  RefreshRequestDto,
  RefreshResponseDto,
  UserProfile,
} from '@/features/auth/model/auth.types';

type Schemas = components['schemas'];
const mapUser = (user: Schemas['User']): UserProfile => ({
  id: user.id,
  name: user.name,
  phone: user.phone,
  role: user.role,
  avatar: user.avatar,
  companyId: user.company_id,
  storeId: user.store_id,
  isActive: user.is_active,
});
const mapTokens = (tokens: Schemas['TokenData']): RefreshResponseDto => ({
  accessToken: tokens.access_token,
  refreshToken: tokens.refresh_token,
  expiresIn: tokens.expires_in,
  refreshExpiresIn: tokens.refresh_expires_in,
});

export async function login(dto: LoginRequestDto): Promise<LoginResponseDto> {
  const { data: response } = await httpClient.post<Schemas['LoginSuccessResponse']>(
    '/auth/login/',
    dto,
  );
  return { ...mapTokens(response.data), user: mapUser(response.data.user) };
}
export async function refreshToken(dto: RefreshRequestDto): Promise<RefreshResponseDto> {
  const { data: response } = await httpClient.post<Schemas['TokenRefreshSuccessResponse']>(
    '/auth/refresh/',
    { refresh_token: dto.refresh_token },
  );
  return mapTokens(response.data);
}
export async function getProfile(): Promise<UserProfile> {
  const { data: response } = await httpClient.get<Schemas['UserSuccessResponse']>('/auth/me/');
  return mapUser(response.data);
}
export async function changePassword(dto: ChangePasswordRequestDto): Promise<void> {
  await httpClient.post('/auth/change-password/', dto);
}
