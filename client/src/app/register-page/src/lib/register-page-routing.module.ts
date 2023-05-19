import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPageComponent } from './register-page/register-page.component';
import {AngularFireAuthGuard} from "@angular/fire/compat/auth-guard";
import {redirectLoggedInTo, redirectUnauthorizedTo} from "@angular/fire/auth-guard";

const routes: Routes = [
  {
    path: '',
    component: RegisterPageComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => redirectLoggedInTo([''])}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterPageRoutingModule { }
