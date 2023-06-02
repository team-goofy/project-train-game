import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../environments/environment";
import { Observable } from "rxjs";
import { Trip, TripResponse } from "@client/shared-models";

@Injectable()
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
}
