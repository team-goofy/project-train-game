import { Component } from '@angular/core';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss']
})
export class StatsPageComponent {
  totalKM: number = 50;
  totalStations: number = 15;
  totalHours: number = 10;
  mostVisitedStation: string = "Utrecht CS";
  mostUsedStartStation: string = "Amsterdam CS";
}
