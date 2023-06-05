import {Component, inject, OnInit} from '@angular/core';
import {TripFilter, TripService} from "@client/shared-services";
import {Trip} from "@client/shared-models";

interface State {
  loading: boolean;
  hasTrips: boolean;
}

@Component({
  selector: 'app-travel-history-page',
  templateUrl: './travel-history-page.component.html',
  styleUrls: ['./travel-history-page.component.scss']
})
export class TravelHistoryPageComponent implements OnInit{
  state: State;
  private _tripService: TripService = inject(TripService);

  private _trips: Trip[] = []
  isAscending: boolean = true;

  constructor() {
    this.state = this.initialState();
  }

  ngOnInit(): void {
    this.state.loading = true;
    const filter = <TripFilter>{ onGoing: false };
    this._tripService.getTrips(filter).subscribe(trips =>{
        if(trips.length == 0){
          this.state.hasTrips = false;
          return;
        }else {
          this._trips = trips;
        }
        this.state.loading = false;
    });
  }

  sortTripsByDate() {
    this._trips = this._trips.reverse();
    this.isAscending = !this.isAscending;
  }

  private initialState(): State {
    return {
      loading: false,
      hasTrips: true
    };
  }

  get trips(): Trip[] {
    return this._trips;
  }

}
