import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../../environments/environment";
import {inject, Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {ExitStationTrain} from "@client/shared-models";

@Injectable()
export class RandomTrainService {
  private http: HttpClient = inject(HttpClient)
  private baseUrl: string = environment.apiUrl;

  getRandomTrain(stationUicCode: string): Observable<ExitStationTrain> {
    return this.http.get<ExitStationTrain>(`${this.baseUrl}/departures/random`,
      {params: {uicCode: stationUicCode}});
  }

}

