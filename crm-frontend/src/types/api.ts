export type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
};
export type ApiError = {
  response: { data: { statusCode: number; success: boolean; message: string } };
};
