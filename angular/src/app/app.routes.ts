import { Routes } from '@angular/router';
import { TestApiComponent } from './components/test-api/test-api.component';
import { authGuard, roleGuard } from './guard/auth.guard';

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
        },
        canActivate: [roleGuard('admin')] // Protege la ruta con el guard de autenticación y rol
    },
    {
        path: 'user',
        loadComponent: () => {
            return import('./view/user/user.component').then(
                m => m.UserComponent //la palabra m se refiere module
            )
        },
        canActivate: [roleGuard('user')] // Protege la ruta con el guard de autenticación y rol
    },
    {
        path: 'login',
        loadComponent: () => {
            return import('./view/login/login.component').then(
                m => m.LoginComponent //la palabra m se refiere module
            )
        },
    },
    {
        path: 'test-api',
        component: TestApiComponent
    },
    {
        path: "**",
        loadComponent: () => {
            return import('./view/not-found/not-found.component').then(
                m => m.NotFoundComponent //la palabra m se refiere module
            )
        }
    }

];
