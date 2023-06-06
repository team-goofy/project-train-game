import {Component, inject, OnInit} from '@angular/core';
import {TripFilter, TripService} from "@client/shared-services";
import {Trip} from "@client/shared-models";
import {PageEvent} from "@angular/material/paginator";

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
  private _isAscending: boolean = true;
  private _currentPage = 0;
  private _pageSize = 5;

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
          this._trips = trips
            .filter(trip => trip.tripEndDate !== undefined)
            .sort((a, b) => new Date(a.tripEndDate!).getTime() - new Date(b.tripEndDate!).getTime());
        }
      this.state.loading = false;
    });
  }

  sortTripsByDate() {
    this._trips = this._trips.reverse();
    this._isAscending = !this._isAscending;
  }
  pageChanged(event: PageEvent) {
    this._currentPage = event.pageIndex;
    this._pageSize = event.pageSize;
  }

  private initialState(): State {
    return {
      loading: false,
      hasTrips: true
    };
  }

  get isAscending(): boolean {
    return this._isAscending;
  }

  get currentPage(): number {
    return this._currentPage;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  get trips(): Trip[] {
    return this._trips;
  }

}
