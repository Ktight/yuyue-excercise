<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { fetchStore, updateStore, setStoreActive, StoreForm, type Store } from '../index';
import {
  fetchRooms,
  createRoom,
  updateRoom,
  setRoomActive,
  RoomList,
  RoomForm,
  type Room,
} from '@/features/rooms';
import { AppPage, AppError, AppLoading, AppEmpty } from '@/app/components';
import { useAuthStore } from '@/features/auth';
import type { StoreWriteInput } from '@/features/stores/model';
const route = useRoute();
const id = Number(route.params.id);
const store = ref<Store | null>(null);
const rooms = ref<Room[]>([]);
const loading = ref(true);
const error = ref('');
const editingRoom = ref<Room | null>(null);
const auth = useAuthStore();
const canManage = ['super_admin', 'company_admin', 'store_manager'].includes(auth.userRole ?? '');
async function submitRoom(value: Parameters<typeof createRoom>[0]) {
  if (editingRoom.value) await updateRoom(editingRoom.value.id, value);
  else await createRoom(value);
  editingRoom.value = null;
}
async function submitStore(value: StoreWriteInput) {
  if (store.value) store.value = await updateStore(store.value.id, value);
}
async function toggleStore() {
  if (
    !store.value ||
    !globalThis.confirm(`确认${store.value.status === 'active' ? '停用' : '启用'}该门店？`)
  )
    return;
  store.value = await setStoreActive(store.value.id, store.value.status !== 'active');
}
async function toggleRoom(room: Room) {
  if (!globalThis.confirm(`确认${room.status === 'active' ? '停用' : '启用'}该场地？`)) return;
  await setRoomActive(room.id, room.status !== 'active');
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
      <StoreForm v-if="canManage" :initial="store" :on-submit="submitStore" />
      <button v-if="canManage" type="button" @click="toggleStore">
        {{ store.status === 'active' ? '停用门店' : '启用门店' }}
      </button>
      <h2>场地</h2>
      <AppEmpty v-if="rooms.length === 0" description="暂无场地" /><RoomList
        v-else
        :rooms="rooms"
        :manageable="canManage"
        @toggle="toggleRoom"
        @edit="editingRoom = $event" /><RoomForm
        v-if="canManage"
        :key="editingRoom?.id ?? 'new'"
        :initial="editingRoom ?? undefined"
        :store-id="store.id"
        :on-submit="submitRoom"
        @success="load" /></template
  ></AppPage>
</template>
