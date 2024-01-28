import { Injectable, inject } from "@angular/core";
import { BaseHttp } from "@web/app/http/base.http";
import { environment } from "@web/env";
import { Observable, catchError } from "rxjs";
import { ILoginCredentialsPayload, ILoginResponsePayload } from "@shared-lib/interfaces";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class AuthHttp extends BaseHttp {
     override url = `${environment.baseApi}/auth`;

     private readonly http = inject(HttpClient);

     login(loginCredentials: ILoginCredentialsPayload): Observable<ILoginResponsePayload> {
        return this.http
        .post<ILoginResponsePayload>(`${this.url}/login`, loginCredentials)
        .pipe(catchError(this.handleError<ILoginResponsePayload>('login', {} as ILoginResponsePayload)));
     }
}