import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RandomTrainComponent } from "./random-train/random-train.component";

const routes: Routes = [
  {
    path: '',
    component: RandomTrainComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RandomTrainRoutingModule { }
