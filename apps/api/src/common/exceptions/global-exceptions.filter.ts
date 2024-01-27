import { CustomHttpExceptionResponse } from '@api/common/exceptions/custom-http-exception-response.interface';
import { HttpExceptionResponse } from '@api/common/exceptions/http-exception.interface';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: HttpStatus
        let error: string;
        let message: string | string[] | undefined;
        
        if(exception instanceof HttpException) {
            status = exception.getStatus();
            const errorResponse = exception.getResponse();
            error = (errorResponse as HttpExceptionResponse).error || exception.message;
            message = (errorResponse as HttpExceptionResponse).message
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            error = 'Internal server error!';
        }

        const errorResponse: CustomHttpExceptionResponse = this.getErrorResponse(status, error, message, request);

        const errorLog = this.getErrorLog(errorResponse, request, exception);
        this.writeErrorLog(errorLog);

        response.status(status).json(errorResponse);
    }

    private getErrorResponse (status: HttpStatus, error: string, message: string | string[] | undefined, request: Request): CustomHttpExceptionResponse {
        return {
            statusCode: status,
            error: error,
            message: message,
            path: request.url,
            method: request.method,
            timestamp: new Date()
        }
    }

    private getErrorLog(errorResponse: CustomHttpExceptionResponse, request: Request, exception: unknown): string {
        const { statusCode, error } = errorResponse;
        const { method, url } = request;
        const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${url}\n\n
        ${JSON.stringify(errorResponse)}\n\n
        ${exception instanceof HttpException ? exception.stack : error}\n\n`;
        return errorLog;
      };
    
      private writeErrorLog(log: string) {
        fs.appendFile(process.env.ERROR_LOG, log, 'utf8', (err) => {
          if (err) throw err;
        });
      };


}