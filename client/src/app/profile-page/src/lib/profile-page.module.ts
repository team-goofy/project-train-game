import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ProfilePageRoutingModule } from "./profile-page-routing.module";
import { HttpClientModule } from "@angular/common/http";
import {ProfilePageComponent} from "./profile-page/profile-page.component";
import { AccountPageComponent } from './account-page/account-page.component';
import { TravelHistoryPageComponent } from './travel-history-page/travel-history-page.component';
import { AchievementsPageComponent } from './achievements-page/achievements-page.component';
import { StatsPageComponent } from './stats-page/stats-page.component';
import {MatTabsModule} from '@angular/material/tabs';



@NgModule({
    imports: [
        CommonModule,
        ProfilePageRoutingModule,
        HttpClientModule,
        MatTabsModule
    ],
    declarations: [
      ProfilePageComponent,
      AccountPageComponent,
      TravelHistoryPageComponent,
      AchievementsPageComponent,
      StatsPageComponent,
    ],
    providers: [
    ]
})
export class ProfilePageModule {}
