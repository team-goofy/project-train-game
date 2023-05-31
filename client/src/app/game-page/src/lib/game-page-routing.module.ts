import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartPageComponent } from "./start-page/start-page.component";
import {RandomTrainComponent} from "./random-train/random-train.component";
import {PictureUploadPageComponent} from "./picture-upload-page/picture-upload-page.component";

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
  {
    path: 'picture-upload',
    component: PictureUploadPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamePageRoutingModule { }
