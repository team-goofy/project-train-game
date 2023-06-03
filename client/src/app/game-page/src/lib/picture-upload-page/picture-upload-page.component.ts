import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { TripService } from "../../../../shared-services/src/lib/trip.service";
import { Trip } from '@client/shared-models';
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  templateUrl: './picture-upload-page.component.html',
  styleUrls: ['./picture-upload-page.component.scss']
})
export class PictureUploadPageComponent implements OnInit {
  @ViewChild('previewImg') private _previewImg?: ElementRef;
  private _tripService: TripService = inject(TripService);
  private _snackbar: MatSnackBar = inject(MatSnackBar);
  private _route: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);

  private _imageUrl!: string ;
  private _tripId: string = "";
  private _uicCode: string = "";
  private _location: string = "";
  private _loading: boolean = false;

  ngOnInit(): void {
    this._route.queryParams.subscribe((params) => {
      this._tripId = params['tripId'];
      this._uicCode = params['uicCode'];
      this._location = params['location'];
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
            })
          );
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
