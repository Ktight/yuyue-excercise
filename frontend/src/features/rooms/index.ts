export { fetchRooms, fetchRoom, createRoom, updateRoom, setRoomActive, deleteRoom } from './api';
export { RoomList, RoomForm, RoomSelect } from './components';
export type { Room, RoomWriteInput, RoomListQuery, RoomListResult } from './model';
export { roomsHandlers } from './mocks/rooms.handlers';
