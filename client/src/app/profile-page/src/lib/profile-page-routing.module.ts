import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProfilePageComponent} from "./profile-page/profile-page.component";
import {AccountPageComponent} from "./account-page/account-page.component";
import {TravelHistoryPageComponent} from "./travel-history-page/travel-history-page.component";
import {AchievementsPageComponent} from "./achievements-page/achievements-page.component";
import {StatsPageComponent} from "./stats-page/stats-page.component";


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ProfilePageComponent,
  },
  {
    path: 'account',
    pathMatch: 'full',
    component: AccountPageComponent,
  },
  {
    path: 'travel-history',
    pathMatch: 'full',
    component: TravelHistoryPageComponent,
  },
  {
    path: 'achievements',
    pathMatch: 'full',
    component: AchievementsPageComponent,
  },
  {
    path: 'stats',
    pathMatch: 'full',
    component: StatsPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfilePageRoutingModule { }
