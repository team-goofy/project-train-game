import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "@client/shared-services";


interface State {
  hasTrips: boolean;
}

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.scss']
})
export class StatsPageComponent implements OnInit {
  private authService: AuthService = inject(AuthService);

  totalMinutes: string | undefined;
  totalVisitedStations: number | undefined;
  mostVisitedStation: string | undefined;
  mostUsedStartLocation: string | undefined;
  state: State;

  constructor() {
    this.state = this.initialState();
  }

  private initialState(): State {
    return {
      hasTrips: true,
    };
  }

  ngOnInit(): void {
    this.getUserStats();
  }

  getUserStats(): void {
    this.authService.getStatsByUid().pipe().subscribe(stats => {
      if (stats.totalStations === 0) {
        this.state.hasTrips = false;
        return;
      }

      this.totalVisitedStations   = stats.totalStations;
      this.mostVisitedStation     = stats.mostVisitedStation;
      this.mostUsedStartLocation  = stats.mostUsedStartLocation;

      if (stats.totalMinutes < 60) {
        this.totalMinutes = stats.totalMinutes + " min";
      } else {
        this.totalMinutes = Math.floor(stats.totalMinutes / 60) + " h " + (stats.totalMinutes % 60) + " min";
      }
    });
  }
}
