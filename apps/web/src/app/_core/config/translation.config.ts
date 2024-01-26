import { LOCATION_INITIALIZED } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Injector } from "@angular/core";
import { TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { environment } from "@web/env";
import { take } from "rxjs";

export function translateLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, `./assets/i18n/`, '.json');
}
  
export const provideTranslation = () => ({
    defaultLanguage: environment.defaultLanguage,
    loader: {
        provide: TranslateLoader,
        useFactory: translateLoaderFactory,
        deps: [HttpClient],
    },
    isolate: false
});

  export function translateAppInitializerFactory(translateService: TranslateService, injector: Injector): () => Promise<unknown> {
    return () => new Promise<unknown>((resolve) => {
      const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
      locationInitialized.then(() => {
        translateService.use(environment.defaultLanguage)
          .pipe(take(1))
          .subscribe(() => resolve(null));
      });
    });
  }
  
  
