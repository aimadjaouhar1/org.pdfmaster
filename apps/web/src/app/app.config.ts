import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '@web/env';

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
});


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    importProvidersFrom(TranslateModule.forRoot(provideTranslation())),
    provideAnimationsAsync()
  ],
};
