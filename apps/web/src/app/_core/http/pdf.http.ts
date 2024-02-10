import { Injectable, inject } from "@angular/core";
import { BaseHttp } from "@web/app/http/base.http";
import { environment } from "@web/env";
import { Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class PdfHttp extends BaseHttp {
     override url = `${environment.baseApi}/pdf`;

     private readonly http = inject(HttpClient);

     split(file: File, interval: number): Observable<HttpResponse<Blob>> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('interval', interval.toString());
        
        return this.http.post(`${this.url}/split`, formData, {
            observe: 'response',
            responseType: "blob"
        })
     }

     extract(file: File, separate: boolean, pageIndices: number[]): Observable<HttpResponse<Blob>> {
        const formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('separate', `${separate}`);
        formData.append('pageIndices', JSON.stringify(pageIndices));

        return this.http.post(`${this.url}/extract`, formData, {
            observe: 'response',
            responseType: "blob"
        })
     }

}