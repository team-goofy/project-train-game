import { Component, inject } from '@angular/core';
import { RandomTrainService } from "../services/random-train.service";
import { Observable } from "rxjs";
import { ExitStationTrain } from "@client/shared-models";

@Component({
  templateUrl: './random-train.component.html',
  styleUrls: ['./random-train.component.scss']
})
export class RandomTrainComponent {
  private randomTrainService: RandomTrainService = inject(RandomTrainService);
  private randomTrain!: Observable<ExitStationTrain>
  //
  // private randomTrain: Observable<ExitStationTrain> = this.randomTrainService.getRandomTrain();

  //TODO: provide getRandomTrain with station to solve error
  // getTrains(): void {
  //   this.randomTrainService.getRandomTrain()
  //     .subscribe(trains => this.randomTrain = trains);
  // }
}
