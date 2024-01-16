import { Route } from '@angular/router';
import { CustomTitleResolver } from '@web/app/resolvers/custom-title.resolver';

export const appRoutes: Route[] = [
    {
        path: 'edit',
        title: CustomTitleResolver,
        data: { title: 'TITLES.PAGE_EDIT'},
        loadComponent: () => import('@web/features/pdf-edit/pdf-edit.component').then(m => m.PdfEditComponent)
    }
];