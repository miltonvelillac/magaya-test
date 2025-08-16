import { Routes } from '@angular/router';
import { UrlsConstants } from '@shared/constants/utls.constant';

export const routes: Routes = [
    {
        path: UrlsConstants.dimensions,
        loadComponent: () => import('@features/dimensions/dimensions.component').then(m => m.DimensionsComponent)
    },
    {
        path: UrlsConstants.locations,
        loadComponent: () => import('@features/locations/locations.component').then(m => m.LocationsComponent)
    },
    {
        path: UrlsConstants.character,
        loadComponent: () => import('@features/character/character.component').then(m => m.CharacterComponent)
    },
    {
        path: UrlsConstants.episodes,
        loadComponent: () => import('@features/episodes/episodes.component').then(m => m.EpisodesComponent)
    },
    {
        path: '**',
        redirectTo: UrlsConstants.dimensions
    }
];
