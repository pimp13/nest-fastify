import { Injectable } from '@nestjs/common';

type ApiResponseParamType = {
  message?: string;
  data?: any;
};

@Injectable()
export class ApiResponseService {
  ok: boolean;
  message?: string;
  data?: any;

  success({ message = 'Success', data }: ApiResponseParamType) {
    return Object.assign(new ApiResponseService(), {
      ok: true,
      message,
      data,
    });
  }

  error({ message = 'Error', data }: ApiResponseParamType) {
    return Object.assign(new ApiResponseService(), {
      ok: false,
      message,
      data,
    });
  }
}
