import { Component, inject, OnInit } from '@angular/core';
import { RandomTrainService } from "../services/random-train.service";
import { ExitStationTrain } from "@client/shared-models";
import { ActivatedRoute } from "@angular/router";
import { TripService } from "../services/trip.service";

@Component({
  templateUrl: './random-train.component.html',
  styleUrls: ['./random-train.component.scss']
})
export class RandomTrainComponent implements OnInit {
  private _randomTrainService: RandomTrainService = inject(RandomTrainService);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _tripService: TripService = inject(TripService);
  private _randomTrain!: ExitStationTrain;

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
        const date = new Date(train.departure.plannedDateTime);
        const time = date.toLocaleTimeString([], {timeStyle: 'short'});

        this._randomTrain = train
        this._randomTrain.departure.plannedDateTime = time;

      });
  }

  saveTrip(): void {
    //TODO; first get trip by id, add the new station to the array before saving
    this._tripService.saveTrip({
      routeStations: [this.randomTrain.exitStation.mediumName],
      isEnded: false
    }).subscribe();
  }

  get randomTrain(): ExitStationTrain {
    return this._randomTrain;
  }
}
