import { Component, inject, OnInit } from '@angular/core';
import { RandomTrainService } from "../services/random-train.service";
import { ExitStationTrain } from "@client/shared-models";
import { ActivatedRoute } from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  templateUrl: './random-train.component.html',
  styleUrls: ['./random-train.component.scss']
})
export class RandomTrainComponent implements OnInit{
  private snackbar: MatSnackBar = inject(MatSnackBar);
  private randomTrainService: RandomTrainService = inject(RandomTrainService);
  private route : ActivatedRoute = inject(ActivatedRoute);
  private _randomTrain!: ExitStationTrain;
  private uicCode: string = "";

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.uicCode = params['uicCode'];
    });

    this.getTrains();
  }

  getTrains(): void {
    this.randomTrainService.getRandomTrain(this.uicCode)
      .subscribe(train => {
        const date = new Date(train.departure.plannedDateTime);
        const time = date.toLocaleTimeString([], { timeStyle: 'short' });

        this._randomTrain = train
        this._randomTrain.departure.plannedDateTime = time;

      });
  }

  // getTrains(): Promise<ExitStationTrain> {
  //   return this.randomTrainService.getRandomTrain(this.uicCode).toPromise() as Promise<ExitStationTrain>;
  // }

  get randomTrain(): ExitStationTrain {
    return this._randomTrain;
  }

  arrivedAtStation(){
    this.snackbar.open(
      "Great to hear that you have arrived at the station!",
      "",
      { horizontalPosition: 'end', duration: 2000 }
    );
  }
}
