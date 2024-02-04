import { Route } from '@angular/router';
import { CustomTitleResolver } from '@web/app/resolvers/custom-title.resolver';
import { PageNotFoundComponent } from '@web/shared/components/page-not-found/page-not-found.component';

export const appRoutes: Route[] = [
    {
        path: 'edit',
        title: CustomTitleResolver,
        data: { title: 'TITLES.PAGE_EDIT'},
        loadComponent: () => import('@web/features/pdf-edit/pdf-edit.component').then(m => m.PdfEditComponent),
    },
    { 
        path: '**', 
        title: CustomTitleResolver,
        pathMatch: 'full',  
        component: PageNotFoundComponent
    }
];