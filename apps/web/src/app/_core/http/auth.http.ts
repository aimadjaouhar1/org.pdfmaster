import { Injectable, inject } from "@angular/core";
import { BaseHttp } from "@web/app/http/base.http";
import { environment } from "@web/env";
import { Observable, catchError } from "rxjs";
import { ILoginCredentialsPayload } from "@shared-lib/interfaces";
import { HttpClient } from "@angular/common/http";
import { ErrorResponse } from "@web/app/exception/error-response.interface";
import { ConnectedUser } from "@shared-lib/types";

@Injectable({
    providedIn: 'root',
})
export class AuthHttp extends BaseHttp {
     override url = `${environment.baseApi}/auth`;

     private readonly http = inject(HttpClient);

     login(loginCredentials: ILoginCredentialsPayload): Observable<ConnectedUser | ErrorResponse> {
        return this.http
        .post<ConnectedUser>(`${this.url}/login`, loginCredentials)
        .pipe(catchError(this.handleError<ErrorResponse>('login')));
     }

     logout(): Observable<void | ErrorResponse> {
        return this.http
        .post<void>(`${this.url}/logout`, undefined)
        .pipe(catchError(this.handleError('logout')));
     }
}