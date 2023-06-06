import { inject, Injectable } from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs";
import {NsTrip, Trip, TripResponse} from "@client/shared-models";
import { createHttpParams } from "@client/shared-utils";

export interface TripFilter {
  onGoing: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private http: HttpClient = inject(HttpClient)
  private baseUrl: string = environment.apiUrl;

  saveImage(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/trip/image`, formData);
  }

  saveTrip(trip: Trip): Observable<TripResponse> {
    return this.http.post<TripResponse>(`${this.baseUrl}/trip`, trip);
  }

  getTripById(tripId: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.baseUrl}/trip/${tripId}`);
  }

  getTripDuration(nsTrips: NsTrip[]): Observable<number> {
    const httpOptions: Object = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    }

    return this.http.post<number>(`${this.baseUrl}/trip/duration`, nsTrips, httpOptions);
  }

  getTrips(filter?: TripFilter): Observable<Trip[]> {
    const params: HttpParams = createHttpParams({ ...filter });
    return this.http.get<Trip[]>(`${this.baseUrl}/trip`, { params });
  }
}
