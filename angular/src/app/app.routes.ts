import { Routes } from '@angular/router';
import path from 'path';
import { TestApiComponent } from './components/test-api/test-api.component';
import { Component } from '@angular/core';

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
    },
    {
        path: 'user',
        loadComponent: () => {
            return import('./view/user/user.component').then(
                m => m.UserComponent //la palabra m se refiere module
            )
        },
    },
    {
        path: 'test-api',
        component: TestApiComponent
    }

];
