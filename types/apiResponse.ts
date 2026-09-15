export interface SuccessResponse<T> {
  statusCode: number;
  // success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponse {
  statusCode: number;
  success: boolean;
  message: string | string[];
  error: string;
}
