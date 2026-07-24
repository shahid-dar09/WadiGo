export interface ApiResponseFormat<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: any;
  meta?: any;
}

export class ApiResponse {
  static success<T>(message: string, data: T | null = null, meta: any = null): ApiResponseFormat<T> {
    return {
      success: true,
      message,
      data,
      meta,
    };
  }

  static error(message: string, errors: any = null): ApiResponseFormat {
    return {
      success: false,
      message,
      data: null,
      errors,
    };
  }
}
