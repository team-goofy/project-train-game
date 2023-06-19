import { Component, inject, OnInit } from '@angular/core';
import { RandomTrainService } from "../services/random-train.service";
import { ExitStationTrain, Trip } from "@client/shared-models";
import { ActivatedRoute, Router } from "@angular/router";
import { TripService } from "../../../../shared-services/src/lib/trip.service";
import { delay, switchMap, tap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

interface State {
  loading: boolean;
  error: string | null;
  randomTrain: ExitStationTrain | null;
}

@Component({
  templateUrl: './random-train.component.html',
  styleUrls: ['./random-train.component.scss']
})
export class RandomTrainComponent implements OnInit {
  private _randomTrainService: RandomTrainService = inject(RandomTrainService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _tripService: TripService = inject(TripService);
  private _snackbar: MatSnackBar = inject(MatSnackBar);
  private _router: Router = inject(Router);

  private _tripId: string = "";
  private _uicCode: string = "";
  private _departureLocation: string = "";
  private _state: State;

  constructor() {
    this._state = this.initialState();
  }
  
  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this._uicCode = params['uicCode'];
      this._departureLocation = params['location'];
      this._tripId = params['tripId'];
    });

    this.getRandomTrain();
  }

  getRandomTrain(): void {
    this.initialState();
    this._state.loading = true;

    this._randomTrainService.getRandomTrain(this._uicCode)
      .pipe(delay(1000))
      .subscribe({
        next: (train) => {
          this._state.randomTrain = train;
          this._state.randomTrain.departure.plannedDateTime = train.departure.plannedDateTime;
          this._state.loading = false;
        }, 
        error: ({ error }) => {
          this._state = this.initialState();
          this._state.error = error.errors.join();
        }
      });
  }

  saveTrip(): void {
    if(this._state.randomTrain === null) {
      return;
    }

    this._state.loading = true;

    this._tripService.getTripById(this._tripId).pipe(
      switchMap((trip: Trip) => {
        trip.routeStations.push(
          {
            uicCode: this._state.randomTrain!.exitStation.uicCode,
            mediumName: this._state.randomTrain!.exitStation.mediumName
          }
        );

        // Add the departureTime to the second last station
        const secondLastIndex = trip.routeStations.length - 2;
        trip.routeStations[secondLastIndex].departureTime = this._state.randomTrain!.departure.plannedDateTime;

        return this._tripService.saveTrip(trip);
      }),
      tap((response) => {
        this._state.loading = false;
        this._snackbar.open(
          "Your trip progress has been saved!",
          "",
          { horizontalPosition: 'end', duration: 2000 }
        );

        this._router.navigate(['game/picture-upload'], {
          queryParams: {
            tripId: response.tripId,
            uicCode: this._state.randomTrain!.exitStation?.uicCode,
            location: this._state.randomTrain!.exitStation?.mediumName
          }
        });
      })
    ).subscribe();
  }

  initialState(): State {
    return <State>{
      loading: false,
      error: null,
      randomTrain: null
    };
  }

  get departureLocation(): string {
    return this._departureLocation;
  }

  get state(): State {
    return this._state;
  }
}
