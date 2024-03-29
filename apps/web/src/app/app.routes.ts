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
        path: 'split',
        title: CustomTitleResolver,
        data: { title: 'TITLES.PAGE_SPLIT'},
        loadComponent: () => import('@web/features/pdf-split/pdf-split.component').then(m => m.PdfSplitComponent),
    },
    {
        path: 'extract',
        title: CustomTitleResolver,
        data: { title: 'TITLES.PAGE_EXTRACT'},
        loadComponent: () => import('@web/features/pdf-extract/pdf-extract.component').then(m => m.PdfExtractComponent),
    },
    { 
        path: '', 
        redirectTo: 'edit', 
        pathMatch: 'full' },
    { 
        path: '**', 
        title: CustomTitleResolver,
        pathMatch: 'full',  
        component: PageNotFoundComponent
    }
];