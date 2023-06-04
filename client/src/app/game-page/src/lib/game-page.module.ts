import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GamePageRoutingModule } from "./game-page-routing.module";
import { StartPageComponent } from "./start-page/start-page.component";
import { BackgroundImageModule } from "@client/shared-components";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { HttpClientModule } from "@angular/common/http";
import { StationService } from "./services/station.service";
import {RandomTrainComponent} from "./random-train/random-train.component";
import {RandomTrainService} from "./services/random-train.service";
import {MatInputModule} from "@angular/material/input";
import { PictureUploadPageComponent } from "./picture-upload-page/picture-upload-page.component";
import { TripService } from "./services/trip.service";
import { MatDialogModule } from "@angular/material/dialog";
import { TripOverviewDialogComponent } from './components/trip-overview-dialog/trip-overview-dialog.component';
import { MatListModule } from "@angular/material/list";

@NgModule({
    imports: [
        CommonModule,
        GamePageRoutingModule,
        BackgroundImageModule,
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatProgressSpinnerModule,
        HttpClientModule,
        MatInputModule,
        MatDialogModule,
        MatListModule
    ],
    declarations: [
      StartPageComponent,
      RandomTrainComponent,
      PictureUploadPageComponent,
      TripOverviewDialogComponent
    ],
    providers: [
      StationService,
      RandomTrainService,
      TripService
    ]
})
export class GamePageModule {}
