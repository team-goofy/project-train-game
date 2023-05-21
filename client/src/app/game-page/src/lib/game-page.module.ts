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
        HttpClientModule
    ],
    declarations: [
      StartPageComponent
    ],
    providers: [
      StationService
    ]
})
export class GamePageModule {}
