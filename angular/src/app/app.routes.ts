import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
        return import('./view/home/home.component').then(
            m => m.HomeComponent //la palabra m se refiere module
        )
    },
},
{
    path:'admin',
    loadComponent: () => {
        return import ('./view/admin/admin.component').then(
            m => m.AdminComponent
        )
    }
}
];
