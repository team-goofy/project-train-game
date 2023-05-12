import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackgroundImageComponent } from './background-image/background-image.component';

const routes: Routes = [
  {
    path: '',
    component: BackgroundImageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackgroundImageRoutingModule { }
