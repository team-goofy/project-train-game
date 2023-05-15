import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HomePageComponent } from "./home-page/home-page.component";
import { HomePageRoutingModule } from "./home-page-routing.module";
import {BackgroundImageModule} from "@client/shared-components";

@NgModule({
    imports: [
        CommonModule,
        HomePageRoutingModule,
        BackgroundImageModule
    ],
    declarations: [
      HomePageComponent,
    ],
})
export class HomePageModule {}
