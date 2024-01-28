import { Observable, of } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { HttpExceptionResponse } from "@web/app/exception/http-exception.interface";
import { ErrorResponse } from "@web/app/exception/error-response.interface";

export abstract class BaseHttp {
    
    protected readonly url!: string;


    protected handleError<T extends ErrorResponse>(operation = 'operation', result?: T) {
        return (error: unknown): Observable<T> => {

          if(error instanceof HttpErrorResponse) {
            const httpExceptionResponse = error.error as HttpExceptionResponse;
            result = {err: true, message: httpExceptionResponse.message || httpExceptionResponse.error, ...result} as T
          }

          return of(result as T);
        };
    }
}