export interface ResponseContent<T, U = any> {
  message?: string;
  metaData?: U;
  headers?: any;
  data: T;
  statusCode?: number;
}
