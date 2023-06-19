import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { AuthService } from "@client/shared-services";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import {UserLoginModel} from "@client/shared-models";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {TwoFaDialogComponent} from "../components/two-fa-dialog/two-fa-dialog.component";
import { Subject, takeUntil } from 'rxjs';

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private snackbar: MatSnackBar = inject(MatSnackBar);
  private _dialog: MatDialog = inject(MatDialog);
  private destroy$: Subject<boolean> = new Subject<boolean>();

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  submitted = false;
  showPassword = true;
  twoFAEnabled = false;

  ngOnInit(): void {
    this.form = this.formBuilder.group(
    {
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/i)
        ]
      ],
      password: [
      '',
      [
        Validators.required,
      ],
    ],
    }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const user = <UserLoginModel>{
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.authService.getUidByEmail(user.email).subscribe({
      next: (data: {uid: string}) => {
        this.handle2FALogin(data.uid);
      },
      error: ({ error }) => {
        console.log('error')
      }
    });
  }

  private handle2FALogin(uid: string): void {
    const user = {
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.authService.getUserCollectionDataWithoutLogin(uid).subscribe(
      (data: any) => {
        const parsedData = JSON.parse(data);
        this.twoFAEnabled = parsedData.is2FaActivated;

        if (this.twoFAEnabled) {
          this.openTwoFaDialog(parsedData, uid, user);
        } else {
            this.authService.login(user)
            .pipe(
              takeUntil(this.destroy$)
            )
            .subscribe(
              (success) => {
                this.handleLoginSuccess();
              },
              (error) => {
                this.handleLoginError();
              }
            );
        }
      },
      () => {
        this.showGenericErrorSnackbar();
      }
    );
  }

  private handleLoginSuccess(): void {
    this.showLoginSuccessSnackbar();
  }

  private handleLoginError(): void {
    this.showGenericErrorSnackbar();
  }

  private openTwoFaDialog(parsedData: any, uid: string, user: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      parsedData: parsedData,
      uid: uid,
      user: user
    };

    this._dialog.open(TwoFaDialogComponent, dialogConfig);
  }

  private showLoginSuccessSnackbar(): void {
    this.snackbar.open(
      "Logged in successfully",
      "",
      { horizontalPosition: 'end', duration: 2000 }
    );
      
    this.router.navigate(['/']);
  }

  private showGenericErrorSnackbar(): void {
    this.snackbar.open(
      "Something went wrong, please try again later",
      "", { horizontalPosition: 'end', duration: 3000 }
    );
  }


  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
