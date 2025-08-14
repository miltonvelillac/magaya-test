import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('@features/dimensions/dimensions.component').then(m => m.DimensionsComponent)
    },
];
