import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RandomTrainRoutingModule } from "./random-train-routing.module";
import { BackgroundImageModule } from "@client/shared-components";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RandomTrainComponent } from "./random-train/random-train.component";

@NgModule({
    imports: [
        CommonModule,
        RandomTrainRoutingModule,
        BackgroundImageModule,
      MatGridListModule,
      MatCardModule,
      MatButtonModule,
      MatIconModule
    ],
    declarations: [
      RandomTrainComponent,
    ],
})
export class RandomTrainModule { }
