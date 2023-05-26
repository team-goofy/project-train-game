import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from "@client/shared-services";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  templateUrl: './verification-page.component.html',
  styleUrls: ['./verification-page.component.scss']
})
export class VerificationPageComponent {
  private authService: AuthService = inject(AuthService);

  private snackbar: MatSnackBar = inject(MatSnackBar);
  isLoading: boolean = false;

  resendMail(): void {
    this.isLoading = true;

    this.authService.sendVerificationMail()
      .subscribe({
      next: () => {
        this.snackbar.open(
          "A verification email has been sent to your email address.",
          "",
          { horizontalPosition: 'end', duration: 6000 }
        );

        this.isLoading = false;
      },
      error: () => {
        this.snackbar.open(
          "Something went wrong, please try again later",
          "", { horizontalPosition: 'end', duration: 3000 });

        this.isLoading = false;
      }
    });
  }
}
