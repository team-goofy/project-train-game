import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerificationPageComponent } from './verification-page/verification-page.component';
import {AngularFireAuthGuard} from "@angular/fire/compat/auth-guard";
import {map} from "rxjs";
import {AuthPipe} from "@angular/fire/auth-guard";

const RedirectUnauthorizedOrVerifiedUser: AuthPipe = map(user => {
  if (user != null) {
    if (!user.emailVerified) {
      return true;
    } else {
      return [''];
    }
  } else {
    return ['login'];
  }
});

const routes: Routes = [
  {
    path: '',
    component: VerificationPageComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: () => RedirectUnauthorizedOrVerifiedUser }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificationPageRoutingModule { }
