import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { TripService } from "../services/trip.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  templateUrl: './picture-upload-page.component.html',
  styleUrls: ['./picture-upload-page.component.scss']
})
export class PictureUploadPageComponent {
  @ViewChild('previewImg') private _previewImg?: ElementRef;
  private _imageUrl!: string ;
  private _pictureUploadService: TripService = inject(TripService);
  private _snackbar: MatSnackBar = inject(MatSnackBar);

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

  uploadImage() {
    if (!this._imageUrl) {
      this._snackbar.open("Please select a picture first!", "Close");
      return;
    }

    fetch(this._imageUrl as string)
      .then(response => response.blob())
      .then(blob => {
        const formData = new FormData();
        //TODO: use real tripId and uicCode
        formData.append('image', blob, "test.jpg");
        formData.append('tripId', "238888993");
        formData.append('uicCode', "222gjgh2");

        this._pictureUploadService.saveImage(formData).subscribe({
          next: () => {
            this._snackbar.open(
              "Image has been uploaded successfully!",
              "",
              { horizontalPosition: 'end', duration: 6000 }
            );
          },
          error: ({ error }) => {
            this._snackbar.open(error.errors.join(), "Close");
          }
        })
      }
    )
  }

  get imageUrl(): string {
    return this._imageUrl;
  }
}
