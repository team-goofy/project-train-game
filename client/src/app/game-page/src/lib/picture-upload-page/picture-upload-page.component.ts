import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { DialogData, TripOverviewDialogComponent } from "../components/trip-overview-dialog/trip-overview-dialog.component";
import { take, EMPTY, of } from "rxjs";
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService, TripService} from '@client/shared-services';
import { NsTrip, RouteStation, Stats, Trip, AchievementStats } from '@client/shared-models';
import { GeolocationService } from '@ng-web-apis/geolocation';
import party from "party-js";

@Component({
  templateUrl: './picture-upload-page.component.html',
  styleUrls: ['./picture-upload-page.component.scss']
})
export class PictureUploadPageComponent implements OnInit {
  @ViewChild('previewImg') private _previewImg?: ElementRef;
  private _authService: AuthService = inject(AuthService);
  private _tripService: TripService = inject(TripService);
  private readonly _geoLocationService: GeolocationService = inject(GeolocationService);
  private _snackbar: MatSnackBar = inject(MatSnackBar);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);
  private _dialog: MatDialog = inject(MatDialog);

  private _imageUrl!: string;
  private _tripId: string = "";
  private _uicCode: string = "";
  private _ltd!: number;
  private _lng!: number;
  private _location: string = "";
  private _loading: boolean = false;
  private _achievementUnlocked: boolean = false;
  private _totalTripDuration: number = 0;

  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this._tripId = params['tripId'];
      this._uicCode = params['uicCode'];
      this._location = params['location'];
    });

    this._geoLocationService.pipe(take(1)).subscribe((position) => {
      this._ltd = position.coords.latitude
      this._lng = position.coords.longitude
    });
  }

  showTripOverview() {
    this._tripService.getTripById(this._tripId).pipe(take(1)).subscribe((trip) => {
      this._dialog.open(TripOverviewDialogComponent, {
        data: <DialogData>{
          stations: trip.routeStations
        }
      });
    });
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this._imageUrl = e.target?.result as string;
        if (this._previewImg) {
          this._previewImg.nativeElement.src = this._imageUrl;
        }
      };
      reader.readAsDataURL(inputElement.files[0]);
    }
  }

  continueTrip() {
    this.saveImage(this._imageUrl, () => {
      this._router.navigate(['/game/random-train'],
      {
        queryParams: {
          tripId: this._tripId,
          uicCode: this._uicCode,
          location: this._location
        }
      });
    });
  }

  endTrip() {
    this.saveImage(this._imageUrl, () => {
      this._tripService.getTripById(this._tripId).pipe(
        catchError(({ error }) => {
          this._snackbar.open(error.errors.join(), "Close");
          return EMPTY;
        }),
        switchMap((trip: Trip) => {
          trip.isEnded = true;
          trip.tripEndDate = new Date().toISOString();
          return this._tripService.saveTrip(trip).pipe(
            catchError(({ error }) => {
              this._snackbar.open(error.errors.join(), "Close");
              return EMPTY;
            }),

            // Get Duration of trip
            switchMap(() => {
              const tripStations: RouteStation[] = trip.routeStations;

              const nsTrips: NsTrip[] = tripStations.map((station, index) => {
                const nextStation = tripStations[index + 1];
                return {
                  originUicCode: station.uicCode,
                  destinationUicCode: nextStation ? nextStation.uicCode : "",
                  departureTime: station.departureTime
                }
              }).filter(nsTrip => nsTrip.departureTime !== null);

              return this._tripService.getTripDuration(nsTrips).pipe(catchError(({ error }) => {
                this._snackbar.open(error.errors.join(), "Close");
                return EMPTY;
              }),

                // Update the user's stats
                switchMap((tripDuration) => {
                this._totalTripDuration = tripDuration;

                return this._authService.updateStats(this._totalTripDuration).pipe(catchError(({ error }) => {
                  this._snackbar.open(error.errors.join(), "Close");
                  return EMPTY;
                }),

                  // Update the user's achievements
                  switchMap((statsResponse: Stats) => {
                  const achievementStats: AchievementStats = {
                    totalTripDuration: this._totalTripDuration,
                    totalVisitedStations: statsResponse.totalStations
                  }

                  return this._authService.updateUsersAchievements(achievementStats).pipe(catchError(({ error }) => {
                    this._snackbar.open(error.errors.join(), "Close");
                    return EMPTY;
                  }),

                    // Set the achievementUnlocked-observable to the value of the response
                    switchMap((hasUnlocked) => {
                      return this.setAchievementUnlocked(JSON.parse(hasUnlocked));
                    }));
                }));
              }));
            }
          ));
        }),
        tap(() => {
          if (!this._achievementUnlocked.valueOf()) {
            this._snackbar.open(
              "Your trip has ended!",
              "",
              { horizontalPosition: 'end', duration: 2000 }
            );

            this._router.navigate(['/']);
          }

          else {
            this.showConfetti();
          }
        })
      ).subscribe();
    });
  }

  private saveImage(imageUrl: string, callback: () => void) {
    if (!imageUrl) {
      callback();
      return;
    }

    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        if (!this.checkValidImageSize(blob)) {
          this._snackbar.open(
            "Image cannot be larger than 1MB!",
            "Close",
            { horizontalPosition: 'end', duration: 2000 }
          );
          return;
        }

        this._loading = true;

        const formData = new FormData();
        formData.append('image', blob);
        formData.append('tripId', this._tripId);
        formData.append('uicCode', this._uicCode);
        formData.append('ltd', this._ltd.toString());
        formData.append('lng', this._lng.toString());

        this._tripService.saveImage(formData).subscribe({
          next: () => {
            this._loading = false;
            this._snackbar.open(
              "Image has been uploaded successfully!",
              "",
              { horizontalPosition: 'end', duration: 2000 }
            );
            callback();
          },
          error: ({ error }) => {
            this._loading = false;
            this._imageUrl = "";
            this._snackbar.open(error.errors.join(), "Close");
          }
        })
      }
    )
  }

  showConfetti() {
    this._snackbar.open(
      "Your trip has ended and you've unlocked a new achievement! Check your profile page!",
      "",
      { horizontalPosition: 'end', duration: 2000 }
    );

    const specificElement: HTMLElement = document.getElementsByClassName('mat-mdc-snack-bar-label')[0] as HTMLElement;

    // Trigger the confetti animation on the snackbar element
    party.confetti(specificElement, {
      count: party.variation.range(20, 30),
      size: party.variation.range(1, 2),
    });

    this._router.navigate(['/']);
  }

  private checkValidImageSize(image: Blob): boolean {
    const IMAGE_MAX_BYTE_SIZE = 1000000;
    return image.size < IMAGE_MAX_BYTE_SIZE;
  }

  setAchievementUnlocked(value: boolean) {
    this._achievementUnlocked = value;
    return of(value);
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  get location(): string {
    return this._location;
  }

  get loading(): boolean {
    return this._loading;
  }
}
