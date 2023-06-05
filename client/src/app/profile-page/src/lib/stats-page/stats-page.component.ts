import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "@client/shared-services";

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

  ngOnInit(): void {
    this.getUserStats();
  }

  getUserStats(): void {
    this.authService.getStatsByUid().pipe().subscribe(stats => {
      if (stats.totalMinutes < 60) {
        this.totalMinutes = stats.totalMinutes + " min";
      } else {
        this.totalMinutes = Math.floor(stats.totalMinutes / 60) + " h " + (stats.totalMinutes % 60) + " min";
      }

      this.totalVisitedStations   = stats.totalStations;
      this.mostVisitedStation     = stats.mostVisitedStation;
      this.mostUsedStartLocation  = stats.mostUsedStartLocation;
    });
  }
}
