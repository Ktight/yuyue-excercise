<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  deleteStore,
  fetchStore,
  updateStore,
  setStoreActive,
  StoreForm,
  type Store,
} from '../index';
import {
  fetchRooms,
  createRoom,
  deleteRoom,
  updateRoom,
  setRoomActive,
  RoomList,
  RoomForm,
  type Room,
} from '@/features/rooms';
import { AppPage, AppError, AppLoading, AppEmpty, confirmAction } from '@/app/components';
import { useAuthStore } from '@/features/auth';
import type { StoreWriteInput } from '@/features/stores/model';
const route = useRoute();
const router = useRouter();
const id = Number(route.params.id);
const store = ref<Store | null>(null);
const rooms = ref<Room[]>([]);
const loading = ref(true);
const error = ref('');
const editingRoom = ref<Room | null>(null);
const auth = useAuthStore();
const canEditStore = ['super_admin', 'company_admin'].includes(auth.userRole ?? '');
const canManageRooms = ['super_admin', 'company_admin', 'store_manager'].includes(
  auth.userRole ?? '',
);
async function submitRoom(value: Parameters<typeof createRoom>[0]) {
  if (editingRoom.value) await updateRoom(editingRoom.value.id, value);
  else await createRoom(value);
  editingRoom.value = null;
}
async function submitStore(value: StoreWriteInput) {
  if (store.value) store.value = await updateStore(store.value.id, value);
}
async function toggleStore() {
  if (!store.value) return;
  const enabling = store.value.status !== 'active';
  if (
    !(await confirmAction({
      title: enabling ? '启用门店' : '停用门店',
      message: enabling
        ? '启用后门店将恢复正常业务使用。'
        : '停用可能影响该门店的排课、预约和人员操作。',
      confirmText: enabling ? '确认启用' : '确认停用',
      danger: !enabling,
    }))
  )
    return;
  store.value = await setStoreActive(store.value.id, store.value.status !== 'active');
}
async function toggleRoom(room: Room) {
  const enabling = room.status !== 'active';
  if (
    !(await confirmAction({
      title: enabling ? '启用场地' : '停用场地',
      message: enabling ? '启用后场地可继续用于排课。' : '停用可能影响关联排课。',
      confirmText: enabling ? '确认启用' : '确认停用',
      danger: !enabling,
    }))
  )
    return;
  await setRoomActive(room.id, room.status !== 'active');
  await load();
}
async function removeStore() {
  if (
    !store.value ||
    !(await confirmAction({
      title: '删除门店',
      message: '删除后门店将无法恢复，并可能影响所属场地与历史业务数据。',
      confirmText: '确认删除',
      danger: true,
    }))
  )
    return;
  await deleteStore(store.value.id);
  await router.push('/admin/stores');
}
async function removeRoom(room: Room) {
  if (
    !(await confirmAction({
      title: '删除场地',
      message: `确认删除场地“${room.name}”？该操作无法恢复。`,
      confirmText: '确认删除',
      danger: true,
    }))
  )
    return;
  await deleteRoom(room.id);
  if (editingRoom.value?.id === room.id) editingRoom.value = null;
  await load();
}
async function load() {
  loading.value = true;
  error.value = '';
  try {
    const [s, r] = await Promise.all([fetchStore(id), fetchRooms({ storeId: id })]);
    store.value = s;
    rooms.value = r.items;
  } catch {
    error.value = '加载门店详情失败';
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>
<template>
  <AppPage :title="store?.name ?? '门店详情'"
    ><AppLoading v-if="loading" /><AppError
      v-else-if="error"
      :message="error"
      show-retry
      @retry="load" /><template v-else-if="store"
      ><p>{{ store.address }}</p>
      <StoreForm v-if="canEditStore" :initial="store" :on-submit="submitStore" />
      <button v-if="canEditStore" type="button" @click="toggleStore">
        {{ store.status === 'active' ? '停用门店' : '启用门店' }}
      </button>
      <button v-if="canEditStore" class="danger" type="button" @click="removeStore">
        删除门店
      </button>
      <h2>场地</h2>
      <AppEmpty v-if="rooms.length === 0" description="暂无场地" /><RoomList
        v-else
        :rooms="rooms"
        :manageable="canManageRooms"
        @toggle="toggleRoom"
        @edit="editingRoom = $event"
        @remove="removeRoom" /><RoomForm
        v-if="canManageRooms"
        :key="editingRoom?.id ?? 'new'"
        :initial="editingRoom ?? undefined"
        :store-id="store.id"
        :on-submit="submitRoom"
        @success="load" /></template
  ></AppPage>
</template>
