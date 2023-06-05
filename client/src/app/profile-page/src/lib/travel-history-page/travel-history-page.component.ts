import {Component, inject, OnInit} from '@angular/core';
import {AuthService, TripFilter, TripService} from "@client/shared-services";
import {Trip} from "@client/shared-models";

@Component({
  selector: 'app-travel-history-page',
  templateUrl: './travel-history-page.component.html',
  styleUrls: ['./travel-history-page.component.scss']
})
export class TravelHistoryPageComponent implements OnInit{
  authService: AuthService = inject(AuthService);
  private _tripService: TripService = inject(TripService);

  private _trips: Trip[] = []
  ngOnInit(): void {
    const filter = <TripFilter>{ onGoing: false };
    this._tripService.getTrips(filter).subscribe(trips =>
      this._trips = trips
    );
  }

  get trips(): Trip[] {
    return this._trips;
  }

}
