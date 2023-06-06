import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { GeolocationService } from '@ng-web-apis/geolocation';
import { PermissionsService } from '@ng-web-apis/permissions';
import { StationService } from '../services/station.service';
import { TripService } from '@client/shared-services';
import { Station, Trip } from '@client/shared-models';
import { catchError, delay, filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, Observable, Subject } from 'rxjs';
import { MatSnackBar } from "@angular/material/snack-bar";

interface State {
  loading: boolean;
  error: string | null;
  permission: PermissionState | null;
}

@Component({
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit, OnDestroy {
  private readonly _geoLocationService: GeolocationService = inject(GeolocationService);
  private readonly _permissionService: PermissionsService = inject(PermissionsService);
  private readonly _stationService: StationService = inject(StationService);
  private _tripService: TripService = inject(TripService);
  private _router: Router = inject(Router);
  private _snackbar: MatSnackBar = inject(MatSnackBar);

  state: State;
  nearestStation$: Observable<Station | null>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.state = this.initialState();
    this.nearestStation$ = this._stationService.nearestStation;
   }

  ngOnInit(): void {
    this.fetchLocation();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  navigateToRandomTrain(): void {
    this.nearestStation$.pipe(
      filter(station => station !== null),
      takeUntil(this.destroy$)
    ).subscribe(station => {
      const trip : Trip = {
        routeStations: station ? [ {uicCode: station.UICCode, mediumName: station.namen.middel} ] : [],
        isEnded: false,
        tripEndDate: ""
      }
      this._tripService.saveTrip(trip).subscribe({
        next: (response) => {
          this._router.navigate(
            ['game/random-train'],
            {
              queryParams: {
                tripId: response.tripId,
                uicCode: station?.UICCode,
                location: station?.namen.lang
              }
            });
        },
        error: (error) => {
          this._snackbar.open(error.errors.join, "Close");
        }
      });
    });
  }

  private initialState(): State {
    return {
      loading: false,
      error: null,
      permission: null
    };
  }
}
