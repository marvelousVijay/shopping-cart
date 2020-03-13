import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

const authRoutes: Routes = [
    { path: '', component: AuthComponent }
];
@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(authRoutes),
        SharedModule
    ]
})
export class AuthModule { }