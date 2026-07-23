export interface ClassMedia {
  id: number;
  classRecordId: number;
  mediaType: 'image' | 'video';
  fileUrl: string;
  thumbnailUrl: string;
  caption: string;
  sortOrder: number;
}
export interface ClassMediaUpdateInput {
  caption?: string;
  sortOrder?: number;
}
export interface UploadResult {
  fileUrl: string;
  thumbnailUrl: string;
}
