import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, AuthPipe } from "@angular/fire/auth-guard";
import { User } from 'firebase/auth';
import { map } from "rxjs";

export const redirectUnauthorizedOrUnverifiedUser: AuthPipe = map(user => {
  if (user != null) {
    if (user.emailVerified) {
      return true;
    } else {
      return ['verify-email'];
    }
  } else {
    return ['login'];
  }
});

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('@client/home-page').then((m) => m.HomePageModule),
  },
  {
    path: 'login',
    pathMatch: 'full',
    loadChildren: () =>
      import('@client/login-page').then((m) => m.LoginPageModule)
  },
  {
    path: 'register',
    pathMatch: 'full',
    loadChildren: () =>
      import('@client/register-page').then((m) => m.RegisterPageModule),
  },
  {
    path: 'game',
    loadChildren: () =>
      import('@client/game-page').then((m) => m.GamePageModule),
    canActivate: [ AuthGuard ],
    data: { authGuardPipe: () => redirectUnauthorizedOrUnverifiedUser }
  },
  {
    path: 'verify-email',
    pathMatch: 'full',
    loadChildren: () =>
      import('@client/verify-page').then((m) => m.VerificationPageModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
