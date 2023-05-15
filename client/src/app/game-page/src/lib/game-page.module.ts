import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { GamePageRoutingModule } from "./game-page-routing.module";
import { GamePageComponent } from "./game-page/game-page.component";

@NgModule({
    imports: [
        CommonModule,
        GamePageRoutingModule,
    ],
    declarations: [
      GamePageComponent,
    ],
})
export class GamePageModule {}
