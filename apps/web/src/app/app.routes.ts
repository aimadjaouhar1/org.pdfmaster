import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: 'edit',
        loadComponent: () => import('@web/features/pdf-edit/pdf-edit.component').then(m => m.PdfEditComponent)
    }
];