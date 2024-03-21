import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseMappings {
  getSuccessResponse<T>(
    data: T,
    message = 'Success',
    status = 200,
  ): IResponseMappings<T> {
    return {
      message: message,
      status: status,
      data: data,
      success: true,
    };
  }

  getErrorResponse<T>(message = 'Error', status = 400): IResponseMappings<T> {
    return {
      message: message,
      status: status,
      success: false,
    };
  }
}
