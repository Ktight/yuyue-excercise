import type { components } from '@/generated/api-types';
import { httpClient } from '@/shared/api';
import type { ClassMedia, ClassMediaUpdateInput, UploadResult } from '@/features/class-media/model';
type S = components['schemas'];
const map = (v: S['ClassMedia']): ClassMedia => ({
  id: v.id,
  classRecordId: v.class_record,
  mediaType: v.media_type,
  fileUrl: v.file_url,
  thumbnailUrl: v.thumbnail_url,
  caption: v.caption,
  sortOrder: v.sort_order,
});
export async function uploadClassMedia(
  file: File,
  mediaType: 'image' | 'video',
): Promise<UploadResult> {
  const data = new FormData();
  data.append('file', file);
  data.append('media_type', mediaType);
  const { data: r } = await httpClient.post<S['FileUploadSuccessResponse']>('/upload/', data);
  return { fileUrl: r.data.file_url, thumbnailUrl: r.data.thumbnail_url };
}
export async function fetchClassMedia(recordId: number): Promise<ClassMedia[]> {
  const { data } = await httpClient.get<S['ClassMediaListSuccessResponse']>(
    `/class-records/${recordId}/media/`,
  );
  return data.data.items.map(map);
}
export async function attachClassMedia(
  recordId: number,
  v: {
    mediaType: 'image' | 'video';
    fileUrl: string;
    thumbnailUrl: string;
    caption: string;
    sortOrder: number;
  },
) {
  const { data } = await httpClient.post<S['ClassMediaSuccessResponse']>(
    `/class-records/${recordId}/media/`,
    {
      media_type: v.mediaType,
      file_url: v.fileUrl,
      thumbnail_url: v.thumbnailUrl,
      caption: v.caption,
      sort_order: v.sortOrder,
    },
  );
  return map(data.data);
}
export async function deleteClassMedia(recordId: number, id: number) {
  await httpClient.delete(`/class-records/${recordId}/media/${id}/`);
}
export async function updateClassMedia(recordId: number, id: number, v: ClassMediaUpdateInput) {
  const body: S['ClassMediaUpdateRequest'] = {
    caption: v.caption,
    sort_order: v.sortOrder,
  };
  const { data } = await httpClient.patch<S['ClassMediaSuccessResponse']>(
    `/class-records/${recordId}/media/${id}/`,
    body,
  );
  return map(data.data);
}
