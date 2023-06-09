import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HomePageComponent } from "./home-page/home-page.component";
import { HomePageRoutingModule } from "./home-page-routing.module";
import { BackgroundImageModule } from "@client/shared-components";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
    imports: [
      CommonModule,
      HomePageRoutingModule,
      BackgroundImageModule,
      MatGridListModule,
      MatCardModule,
      MatButtonModule,
      MatIconModule,
      MatListModule,
      MatDialogModule
    ],
    declarations: [
      HomePageComponent,
    ],
})
export class HomePageModule {}
