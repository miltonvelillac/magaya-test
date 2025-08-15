import { Routes } from '@angular/router';
import { UrlsConstants } from '@shared/constants/utls.constant';

export const routes: Routes = [
    {
        path: UrlsConstants.locations,
        loadComponent: () => import('@features/dimensions/dimensions.component').then(m => m.DimensionsComponent)
    },
    {
        path: '**',
        redirectTo: UrlsConstants.locations
    }
];
