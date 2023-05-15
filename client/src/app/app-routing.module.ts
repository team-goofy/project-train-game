import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
      import('@client/login-page').then((m) => m.LoginPageModule),
  },
  {
    path: 'game',
    pathMatch: 'full',
    loadChildren: () =>
      import('@client/game-page').then((m) => m.GamePageModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
