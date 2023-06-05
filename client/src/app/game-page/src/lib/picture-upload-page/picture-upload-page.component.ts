import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";
import { DialogData, TripOverviewDialogComponent } from "../components/trip-overview-dialog/trip-overview-dialog.component";
import { take, EMPTY} from "rxjs";
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService, TripService} from '@client/shared-services';
import { NsTrip, RouteStation, Trip } from '@client/shared-models';

@Component({
  templateUrl: './picture-upload-page.component.html',
  styleUrls: ['./picture-upload-page.component.scss']
})
export class PictureUploadPageComponent implements OnInit {
  @ViewChild('previewImg') private _previewImg?: ElementRef;
  private _authService: AuthService = inject(AuthService);
  private _tripService: TripService = inject(TripService);
  private _snackbar: MatSnackBar = inject(MatSnackBar);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);
  private _dialog: MatDialog = inject(MatDialog);

  private _imageUrl!: string;
  private _tripId: string = "";
  private _uicCode: string = "";
  private _location: string = "";
  private _loading: boolean = false;
  private _totalTripDuration: number = 0;

  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this._tripId = params['tripId'];
      this._uicCode = params['uicCode'];
      this._location = params['location'];
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
          return this._tripService.saveTrip(trip).pipe(
            catchError(({ error }) => {
              this._snackbar.open(error.errors.join(), "Close");
              return EMPTY;
            }),
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
              }), switchMap((tripDuration) => {
                this._totalTripDuration = tripDuration;
                return this._authService.updateStats(this._totalTripDuration);
              }));
            }
          ));
        }),
        tap(() => {
          let ref = this._snackbar.open(
            "Your trip has ended!",
            "",
            { horizontalPosition: 'end', duration: 2000 }
          );

          ref.afterDismissed().subscribe(() => {
            this._router.navigate(['/']);
          })
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

  private checkValidImageSize(image: Blob): boolean {
    const IMAGE_MAX_BYTE_SIZE = 1000000;
    return image.size < IMAGE_MAX_BYTE_SIZE;
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
