import { describe, expect, it } from 'vitest';
import { server } from '@/shared/mocks/server';
import { companiesHandlers } from '@/features/companies/mocks/companies.handlers';
import { storesHandlers } from '@/features/stores/mocks/stores.handlers';
import { roomsHandlers } from '@/features/rooms/mocks/rooms.handlers';
import { createCompany, deleteCompany, fetchCompanies } from './companies.adapter';
import { createStore, deleteStore, fetchStores } from './stores.adapter';
import { createRoom, deleteRoom, fetchRooms } from './rooms.adapter';

describe('organization deletion adapters', () => {
  it('deletes companies through the frozen contract path', async () => {
    server.use(...companiesHandlers);
    const created = await createCompany({
      name: '待删除公司',
      contactPerson: '测试联系人',
      contactPhone: '13800000009',
      contractStart: '2026-01-01',
      contractEnd: '2027-01-01',
    });

    await deleteCompany(created.id);

    expect((await fetchCompanies()).items.some((item) => item.id === created.id)).toBe(false);
  });

  it('deletes stores through the frozen contract path', async () => {
    server.use(...storesHandlers);
    const created = await createStore({
      name: '待删除门店',
      address: '测试地址',
      phone: '01088880000',
      businessHours: '08:00-20:00',
    });

    await deleteStore(created.id);

    expect((await fetchStores()).items.some((item) => item.id === created.id)).toBe(false);
  });

  it('deletes rooms through the frozen contract path', async () => {
    server.use(...roomsHandlers);
    const created = await createRoom({
      storeId: 1,
      name: '待删除场地',
      capacity: 10,
      facilities: [],
    });

    await deleteRoom(created.id);

    expect((await fetchRooms({ storeId: 1 })).items.some((item) => item.id === created.id)).toBe(
      false,
    );
  });
});
