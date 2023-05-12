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
    path: 'background-image',
    pathMatch: 'full',
    loadChildren: () =>
      import('@client/background-image').then((m) => m.BackgroundImageModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
