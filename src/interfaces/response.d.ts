export interface CustomResponse<T = undefined> {
  message: string;
  data: T;
}

export interface CustomErrorResponse
  extends CustomResponse<{
    name: string;
  }> {}
