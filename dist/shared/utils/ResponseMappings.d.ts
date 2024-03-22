export declare class ResponseMappings {
    getSuccessResponse<T>(data: T, message?: string, status?: number): IResponseMappings<T>;
    getErrorResponse<T>(message?: string, status?: number): IResponseMappings<T>;
}
