import { HttpClient } from "@angular/common/http";
import {Injectable, inject} from "@angular/core";
import { Station } from "@client/shared-models";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class StationService {
    private _http: HttpClient = inject(HttpClient);
    private _baseUrl: String = environment.apiUrl;

    getNearestStation(lat: number, lng: number): Observable<Station> {
        return this._http.get<Station>(`${this._baseUrl}/station/nearest`, { params: { lat, lng } });
    }
}
