import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ExitStationTrainModel } from "@client/shared-models";
// import { Station } from "@client/shared-models";

@Injectable()
export class RandomTrainService {

  private http: HttpClient = inject(HttpClient)
  private baseUrl: String = environment.apiUrl;
  // register(userRequestModel: UserRequestModel): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/user/register`, userRequestModel);
  // }

  getRandomTrain(station: ExitStationTrainModel): Observable<ExitStationTrainModel> {
    return this.http.get(`${this.baseUrl}/departures/random`, { params: { station } });
  }
}
