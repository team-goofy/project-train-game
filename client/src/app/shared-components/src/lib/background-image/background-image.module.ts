import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BackgroundImageComponent } from "./background-image.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BackgroundImageComponent,
  ],
  exports: [
    BackgroundImageComponent
  ]
})
export class BackgroundImageModule {}
