import {Component, Inject, inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import { RouteStation } from "@client/shared-models";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "@client/shared-services";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";

export interface DialogData {
  stations: RouteStation[];
}

interface State {
  valueHasNotBeenChanged: boolean;
}

@Component({
  selector: 'app-two-fa-dialog',
  templateUrl: './two-fa-dialog.component.html',
  styleUrls: ['./two-fa-dialog.component.scss']
})
export class TwoFaDialogComponent implements OnDestroy {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private snackbar: MatSnackBar = inject(MatSnackBar);
  public data: DialogData = inject(MAT_DIALOG_DATA);

  twoFAForm: FormGroup = new FormGroup({
    authCode: new FormControl('')
  });

  state: State;
  private secret: string = "";
  private uid: string = "";
  private user: any;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(@Inject(MAT_DIALOG_DATA) public userData: any, private dialogRef: MatDialogRef<TwoFaDialogComponent>) {
    // Access the passed data using this.data
    this.secret = userData.parsedData.secret;
    this.uid = userData.uid;
    this.user = userData.user;
    this.state = this.initialState();
  }

  initialState(): State {
    return {
      valueHasNotBeenChanged: true
    };
  }

  ngOnInit(): void {
    this.twoFAForm = this.formBuilder.group({
      authCode: [
        '', // Empty starting value
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(6),
          Validators.maxLength(6),
        ]
      ]
    });

    this.twoFAForm.valueChanges.subscribe((formValue) => {
      const authCodeValue = String(this.twoFAForm.controls['authCode'].value);
      const length = authCodeValue.length;
      this.state.valueHasNotBeenChanged = length !== 6 && authCodeValue !== '';
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  checkLength(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length >= 6 && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

  verify2FA() {
    const givenAuthCode = this.twoFAForm.controls['authCode'].value.toString();

    this.authService.verify2FALogin(this.secret, givenAuthCode, this.uid).subscribe(
      (success) => {
        this.authService.login(this.user)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(
          (success) => {
            this.dialogRef.close();
            this.show2FALoginSuccessSnackbar();
          },
          (error) => {
            this.handleLoginError();
          }
        );
      },
      (error) => {
        this.showWrongCodeErrorSnackbar();
      }
    );
  }

  private handleLoginError(): void {
    this.showGenericErrorSnackbar();
  }

  private showGenericErrorSnackbar(): void {
    this.snackbar.open(
      "Something went wrong, please try again later",
      "", { horizontalPosition: 'end', duration: 3000 }
    );
  }

  private show2FALoginSuccessSnackbar(): void {
    this.snackbar.open(
      "2FA login successfully",
      "",
      { horizontalPosition: 'end', duration: 2000 }
    );

    this.router.navigate(['/']);
  }

  private showWrongCodeErrorSnackbar(): void {
    this.snackbar.open(
      "It looks like you entered the wrong code, please try again",
      "",
      { horizontalPosition: 'end', duration: 2000 }
    );

    this.router.navigate(['/login']);
  }



  get e(): { [key: string]: AbstractControl } {
    return this.twoFAForm.controls;
  }

}
