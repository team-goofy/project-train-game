import { Component, OnInit, inject } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { PermissionsService } from '@ng-web-apis/permissions';
import { StationService } from '../services/station.service';
import { Station } from '@client/shared-models';
import { catchError, delay, filter, switchMap, take, tap } from 'rxjs/operators';
import { EMPTY, Observable } from 'rxjs';

interface State {
  loading: boolean;
  error: string | null;
  permission: PermissionState | null;
}

@Component({
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {
  private readonly _geoLocationService: GeolocationService = inject(GeolocationService);
  private readonly _permissionService: PermissionsService = inject(PermissionsService);
  private readonly _stationService: StationService = inject(StationService);

  state: State;
  nearestStation$: Observable<Station | null>;

  constructor() {
    this.state = this.initialState();
    this.nearestStation$ = this._stationService.nearestStation;
   }

  ngOnInit(): void {
    this.fetchLocation();
  }

  fetchLocation(): void {
    this.state = this.initialState();
    this.state.loading = true;

    this._permissionService.state('geolocation').pipe(
      tap((state: PermissionState) => this.state.permission = state),
      filter((state: PermissionState) => state === 'granted'),
      switchMap(() => this._geoLocationService.pipe(take(1))),
      catchError((error: GeolocationPositionError) => {
        this.state = this.initialState();

        if (error.code === error.PERMISSION_DENIED) {
          this.state.permission = 'denied';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          this.state.error = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          this.state.error = 'The request to get user location timed out.';
        }

        return EMPTY;
      }),
      delay(1000),
      tap((position: GeolocationPosition) => {
        this._stationService.init(position.coords.latitude, position.coords.longitude)
        this.state.loading = false;
      }),
      catchError(() => {
        this.state = this.initialState();
        this.state.error = 'Something went wrong. Please try again later.';
        return EMPTY;
      })
    ).subscribe();
  }

  private initialState(): State {
    return {
      loading: false,
      error: null,
      permission: null
    };
  }
}
