import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ExitStationTrain, Station } from "@client/shared-models";
// import { Station } from "@client/shared-models";

@Injectable()
export class RandomTrainService {

  private http: HttpClient = inject(HttpClient)
  private baseUrl: string = environment.apiUrl;

  //TODO: Change variable to type of Station
  getRandomTrain(station: Station): Observable<ExitStationTrain> {
    return this.http.get<ExitStationTrain>(`${this.baseUrl}/departures/random`,
      { params: { uicCode: station.UICCode } });
  }

}

