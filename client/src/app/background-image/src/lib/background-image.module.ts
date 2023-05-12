import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BackgroundImageComponent } from "./background-image/background-image.component";
import { BackgroundImageRoutingModule } from "./background-image-routing.module";

@NgModule({
    imports: [
      CommonModule,
      BackgroundImageRoutingModule
    ],
    declarations: [
      BackgroundImageComponent,
    ],
})
export class BackgroundImageModule {}
