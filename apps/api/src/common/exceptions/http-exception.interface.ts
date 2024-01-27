export interface HttpExceptionResponse {
    message: string | string[] | undefined;
    statusCode: number;
    error: string;
}