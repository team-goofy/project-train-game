import {Component, inject, OnInit} from '@angular/core';
import {RandomTrainService} from "../services/random-train.service";
import {ExitStationTrain} from "@client/shared-models";
import {ActivatedRoute} from "@angular/router";

@Component({
  templateUrl: './random-train.component.html',
  styleUrls: ['./random-train.component.scss']
})
export class RandomTrainComponent implements OnInit {
  private randomTrainService: RandomTrainService = inject(RandomTrainService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private _randomTrain!: ExitStationTrain;
  private uicCode: string = "";
  private departureLocation: string = "";
  //TODO: add a query-param for tripId maybe?

  get departureLocationValue(): string {
    return this.departureLocation;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.uicCode = params['uicCode'];
      this.departureLocation = params['location'];
    });

    this.getRandomTrain();
  }

  getRandomTrain(): void {
    this.randomTrainService.getRandomTrain(this.uicCode)
      .subscribe(train => {
        const date = new Date(train.departure.plannedDateTime);
        const time = date.toLocaleTimeString([], {timeStyle: 'short'});

        this._randomTrain = train
        this._randomTrain.departure.plannedDateTime = time;

      });
  }

  saveTrip(): void {
    //TODO: navigate to konrad's page
    this.randomTrainService.saveTrip({
      routeStations: [this.randomTrain.exitStation.mediumName],
      isEnded: false
    }).subscribe();
  }

  get randomTrain(): ExitStationTrain {
    return this._randomTrain;
  }
}
