import { Component, OnInit, inject } from '@angular/core';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { PermissionsService } from '@ng-web-apis/permissions';
import { StationService } from '../services/station.service';
import { Station } from '@client/shared-models';
import { catchError, delay, filter, switchMap, take, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  private readonly _geoLocationService: GeolocationService = inject(GeolocationService);
  private readonly _permissionService: PermissionsService = inject(PermissionsService);
  private readonly _stationService: StationService = inject(StationService);

  loading: boolean = false;
  station?: Station | null = null;
  error?: string | null = null;
  permissionState?: PermissionState | null = null;

  ngOnInit(): void {
    this.fetchLocation();
  }

  fetchLocation(): void {
    this.loading = true;

    this._permissionService.state('geolocation').pipe(
      tap((state: PermissionState) => this.permissionState = state),
      filter((state: PermissionState) => state === 'granted'),
      switchMap(() => this._geoLocationService.pipe(take(1))),
      catchError((error: GeolocationPositionError) => {
        this.permissionState = null;
        this.loading = false;

        if (error.code === error.PERMISSION_DENIED) {
          this.permissionState = 'denied';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          this.error = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          this.error = 'The request to get user location timed out.';
        }

        return EMPTY;
      }),
      delay(1000),
      switchMap((position: GeolocationPosition) =>
        this._stationService.getNearestStation(position.coords.latitude, position.coords.longitude)
      ),
      tap((station: Station) => {
        this.station = station;
        this.loading = false;
      }),
      catchError((error) => {
        console.error(error);
        this.loading = false;
        this.error = error;
        return EMPTY;
      })
    ).subscribe();
  }
}
