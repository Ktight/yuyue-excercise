export interface ApiEnvelope<T> {
  code: string;
  message: string;
  data: T;
}

export interface ApiPage<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}
