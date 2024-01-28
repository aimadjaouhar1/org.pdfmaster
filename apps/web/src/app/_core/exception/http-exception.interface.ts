export interface HttpExceptionResponse {
    statusCode: number,
    error: string,
    message: string | string[] | undefined,
    path: string,
    method: string,
    timestamp: Date
};

