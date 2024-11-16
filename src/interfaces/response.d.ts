export interface CustomResponse<T = undefined> {
  message: string;
  data: T;
}
