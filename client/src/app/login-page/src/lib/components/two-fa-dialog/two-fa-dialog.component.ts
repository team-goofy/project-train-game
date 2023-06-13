import {Component, Inject, inject} from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { RouteStation } from "@client/shared-models";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "@client/shared-services";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {debounceTime, distinctUntilChanged} from "rxjs";

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
export class TwoFaDialogComponent {
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

  constructor(@Inject(MAT_DIALOG_DATA) public userData: any) {
    // Access the passed data using this.data
    this.secret = userData.secret;
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

  checkLength(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length >= 6 && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

  verify2FA() {
    const givenAuthCode = this.twoFAForm.controls['authCode'].value.toString();

    this.authService.verify2FA(this.secret, givenAuthCode).subscribe(
      (success) => {
        this.show2FALoginSuccessSnackbar();
      },
      (error) => {
        this.showWrongCodeErrorSnackbar();
      }
    );
  }

  private show2FALoginSuccessSnackbar(): void {
    const ref = this.snackbar.open(
      "2FA login successfully",
      "",
      { horizontalPosition: 'end', duration: 2000 }
    );

    ref.afterDismissed().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  private showWrongCodeErrorSnackbar(): void {
    const ref = this.snackbar.open(
      "It looks like you entered the wrong code, please try again",
      "",
      { horizontalPosition: 'end', duration: 2000 }
    );

    ref.afterDismissed().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }



  get e(): { [key: string]: AbstractControl } {
    return this.twoFAForm.controls;
  }

}
