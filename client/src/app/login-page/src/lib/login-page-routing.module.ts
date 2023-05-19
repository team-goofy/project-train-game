import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import {AngularFireAuthGuard} from "@angular/fire/compat/auth-guard";
import {redirectLoggedInTo} from "@angular/fire/auth-guard";

const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () =>  redirectLoggedInTo([''])}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginPageRoutingModule { }
