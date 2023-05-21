import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartPageComponent } from "./start-page/start-page.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: StartPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamePageRoutingModule { }
