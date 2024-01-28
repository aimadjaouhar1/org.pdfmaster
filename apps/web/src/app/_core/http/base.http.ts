import { Observable, of } from "rxjs";

export abstract class BaseHttp {
    
    protected readonly url!: string;

    protected handleError<T>(operation = 'operation', result?: T) {
        return (error: unknown): Observable<T> => {
          console.error(`${operation} failed: ${error}`);
          return of(result as T);
        };
    }
}