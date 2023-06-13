import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ProfilePageRoutingModule } from "./profile-page-routing.module";
import { HttpClientModule } from "@angular/common/http";
import { ProfilePageComponent } from "./profile-page/profile-page.component";
import { AccountPageComponent } from './account-page/account-page.component';
import { TravelHistoryPageComponent } from './travel-history-page/travel-history-page.component';
import { AchievementsPageComponent } from './achievements-page/achievements-page.component';
import { StatsPageComponent } from './stats-page/stats-page.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from "@angular/material/icon";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule} from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatStepperModule } from "@angular/material/stepper";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginatorModule } from "@angular/material/paginator";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";

@NgModule({
  imports: [
    CommonModule,
    ProfilePageRoutingModule,
    HttpClientModule,
    MatTabsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatStepperModule,
    MatCardModule,
    MatGridListModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    LeafletModule
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
