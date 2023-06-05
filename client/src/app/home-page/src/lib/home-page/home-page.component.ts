import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Trip } from '@client/shared-models';
import { AuthService, TripFilter, TripService } from "@client/shared-services";

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  private _tripService: TripService = inject(TripService);
  private _router: Router = inject(Router);

  private _trips: Trip[] = []

  ngOnInit(): void {
    const filter = <TripFilter>{ onGoing: true };
    this._tripService.getTrips(filter).subscribe(trips => this._trips = trips);
  }

  scrollTo(target: HTMLDivElement) {
    target.scrollIntoView({behavior: 'smooth'});
  }

  tripClicked(trip: Trip) {
    const latestTripStation = trip.routeStations[trip.routeStations.length - 1];
    this._router.navigate(['/game/random-train'], 
    { 
      queryParams: { 
        tripId: trip.tripId, 
        uicCode: latestTripStation.uicCode, 
        location: latestTripStation.mediumName
      } 
    });
  }

  get trips(): Trip[] {
    return this._trips;
  }
}
