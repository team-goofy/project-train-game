import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GamePageRoutingModule } from "./game-page-routing.module";
import { GamePageComponent } from "./game-page/game-page.component";
import { BackgroundImageModule } from "@client/shared-components";
import { StartLocationComponent } from './components/start-location/start-location.component';
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@NgModule({
    imports: [
        CommonModule,
        GamePageRoutingModule,
        BackgroundImageModule, 
        MatCardModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule, 
        MatProgressSpinnerModule
    ],
    declarations: [
      GamePageComponent,
      StartLocationComponent,
    ],
})
export class GamePageModule {}
