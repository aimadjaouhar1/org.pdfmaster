import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { environment } from '@web/env';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class CustomTitleResolver {
    constructor(
        private _translateService: TranslateService,
    ) {}

    resolve(route: ActivatedRouteSnapshot): Promise<string> {
        if (!route.data['title']) {
            return Promise.resolve(environment.appName);
        }

        return Promise.resolve(
            `${environment.appName} | ${this._translateService.instant(route.data['title'])}`
        );
    }
}

