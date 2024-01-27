import { HttpExceptionResponse } from "@api/common/exceptions/http-exception.interface";

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
    path: string;
    method: string;
    timestamp: Date;
    message: string | string[] | undefined;
}