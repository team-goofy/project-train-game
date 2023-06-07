import { Component, inject, OnInit } from '@angular/core';
import { RandomTrainService } from "../services/random-train.service";
import { ExitStationTrain, Trip } from "@client/shared-models";
import { ActivatedRoute, Router } from "@angular/router";
import { TripService } from "../../../../shared-services/src/lib/trip.service";
import { switchMap, tap } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  templateUrl: './random-train.component.html',
  styleUrls: ['./random-train.component.scss']
})
export class RandomTrainComponent implements OnInit {
  private _randomTrainService: RandomTrainService = inject(RandomTrainService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _tripService: TripService = inject(TripService);
  private _randomTrain!: ExitStationTrain;
  private _snackbar: MatSnackBar = inject(MatSnackBar);
  private _router: Router = inject(Router);

  private _trainIsNull: boolean = false;

  private tripId: string = "";
  private uicCode: string = "";
  private departureLocation: string = "";

  get departureLocationValue(): string {
    return this.departureLocation;
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this.uicCode = params['uicCode'];
      this.departureLocation = params['location'];
      this.tripId = params['tripId'];
    });

    this.getRandomTrain();
  }

  getRandomTrain(): void {
    this._randomTrainService.getRandomTrain(this.uicCode)
      .subscribe(train => {
        if(train !== null){
          this._randomTrain = train
          this._randomTrain.departure.plannedDateTime = train.departure.plannedDateTime;
        }else{
          this._trainIsNull = true;
        }

      });
  }

  saveTrip(): void {
    this._tripService.getTripById(this.tripId).pipe(
      switchMap((trip: Trip) => {
        trip.routeStations.push(
          {
            uicCode: this._randomTrain.exitStation.uicCode,
            mediumName: this._randomTrain.exitStation.mediumName
          }
        );

        // Add the departureTime to the second last station
        const secondLastIndex = trip.routeStations.length - 2;
        trip.routeStations[secondLastIndex].departureTime = this._randomTrain.departure.plannedDateTime;

        return this._tripService.saveTrip(trip);
      }),
      tap((response) => {
        let ref = this._snackbar.open(
          "Your trip progress has been saved!",
          "",
          { horizontalPosition: 'end', duration: 2000 }
        );

        ref.afterDismissed().subscribe(() => {
          this._router.navigate(['game/picture-upload'],
            {
              queryParams: {
                tripId: response.tripId,
                uicCode: this._randomTrain.exitStation.uicCode,
                location: this._randomTrain.exitStation.mediumName
              }
            });
        });
      })
    ).subscribe();
  }

  get randomTrain(): ExitStationTrain {
    return this._randomTrain;
  }


  get trainIsNull(): boolean {
    return this._trainIsNull;
  }

}
