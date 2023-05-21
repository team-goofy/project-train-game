import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Station } from "@client/shared-models";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class StationService {
    private _http: HttpClient = inject(HttpClient);
    private _baseUrl: string = environment.apiUrl;
    private _nearestStation$ = new BehaviorSubject<Station | null>(null);

    init(lat: number, lng: number): void {
        this._http
        .get<Station>(`${this._baseUrl}/station/nearest`, { params: { lat, lng } })
        .subscribe(station => {
            this._nearestStation$.next(station)
        });
    }

    get nearestStation(): Observable<Station | null> {
        return this._nearestStation$.asObservable();
    }
}
