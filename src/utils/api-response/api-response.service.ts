import { Injectable } from '@nestjs/common';

export type ApiResponseParamType<T> = {
  message?: string;
  data?: T;
};

export class ApiResponse<T> {
  ok!: boolean;
  message?: string;
  data?: T;
}

@Injectable()
export class ApiResponseService {
  success<T>({
    message = 'Success',
    data,
  }: ApiResponseParamType<T>): ApiResponse<T> {
    return {
      ok: true,
      message,
      data,
    };
  }

  error<T>({
    message = 'Error',
    data,
  }: ApiResponseParamType<T>): ApiResponse<T> {
    return {
      ok: false,
      message,
      data,
    };
  }
}
