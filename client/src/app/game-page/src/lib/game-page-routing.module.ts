import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartPageComponent } from "./start-page/start-page.component";
import {RandomTrainComponent} from "./random-train/random-train.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: StartPageComponent,
  },
  {
    path: 'random-train',
    component: RandomTrainComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamePageRoutingModule { }
