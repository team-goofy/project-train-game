import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {AuthService} from "@client/shared-services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserRequestModel} from "@client/shared-models";
import {debounceTime, distinctUntilChanged} from "rxjs";
import {Router} from "@angular/router";
import {SafeUrl} from "@angular/platform-browser";

interface State {
  loading: boolean;
  error: string | null;
  editing: boolean;
  valueHasNotBeenChanged: boolean;
  enable2FA: boolean;
}

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private snackbar: MatSnackBar = inject(MatSnackBar);

  accountEditForm: FormGroup = new FormGroup({
    userEmailForm: new FormControl(''),
    userUsername: new FormControl(''),
  });

  twoFAForm: FormGroup = new FormGroup({
    authCode: new FormControl('')
  });

  private username: string = "";
  private userEmail: string | null  = "";
  private _twoFAEnabled: boolean = false;
  private _secret: string = this.generateSecretKey(16);

  state: State;

  public myAngularxQrCode: string = "";
  public qrCodeDownloadLink: SafeUrl = "";

  constructor() {
    this.state = this.initialState();
  }

  generateSecretKey(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      secret += chars[randomIndex];
    }
    return secret;
  }

  generateQRCode(): void {
    this.myAngularxQrCode = `otpauth://totp/${this.username}?secret=${this._secret}&issuer=WanderTrains`;
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  ngOnInit(): void {
    this.fetchUserData();

    this.accountEditForm = this.formBuilder.group(
      {
        userEmailForm: [
          { value: '', disabled: this.state.valueHasNotBeenChanged },
          [
            Validators.required,
            Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/i)
          ]
        ],
        userUsername: [
          { value: '', disabled: this.state.valueHasNotBeenChanged },
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(25),
          ],
        ]
      }
    );

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


    this.accountEditForm.controls['userUsername'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe({
      next: (value: string) => {
        if(this.accountEditForm.value.userUsername !== this.usernameValue && this.accountEditForm.value.userEmailForm){
          this.authService.checkUsername(value).subscribe({
            next: (exists: boolean) => {
              if (exists) {
                this.accountEditForm.controls['userUsername'].setErrors({ usernameExists: true });
              }
            }
          });
        }
      }
    });
  }

  fetchUserData(): void{
    this.state.loading = true;

    this.accountEditForm.controls['userEmailForm'].disable();
    this.accountEditForm.controls['userUsername'].disable();

    const userData = this.authService.getUserData();
    if(userData && userData.email){
      this.userEmail = userData.email;

    }

    this.authService.getUserCollectionData()
      .subscribe({
        next: (data:any) => {
          const parsedData = JSON.parse(data);
          this.username = parsedData.username;
          this._twoFAEnabled = parsedData.is2FaActivated;

          this.accountEditForm.controls['userEmailForm'].setValue(this.userEmail);
          this.accountEditForm.controls['userUsername'].setValue(this.username);

          this.generateQRCode();

          this.state.loading = false;
          },
        error: () => {
          this.state.loading = false;
          this.snackbar.open(
            "Something went wrong, please try again later",
            "", { horizontalPosition: 'end', duration: 3000 });
        }
      });
  }

  initialState(): State {
    return {
      loading: false,
      error: null,
      editing: false,
      valueHasNotBeenChanged: true,
      enable2FA: false
    };
  }

  editingState(): void {
    this.accountEditForm.valueChanges.subscribe((formValue) => {
      if (this.accountEditForm.value.userUsername === this.usernameValue && this.accountEditForm.value.userEmailForm === this.userEmailValue) {
        this.state.valueHasNotBeenChanged = true;
      } else if (this.accountEditForm.value.userUsername === '' || this.accountEditForm.value.userEmailForm === '') {
        this.state.valueHasNotBeenChanged = true;
      } else {
        this.state.valueHasNotBeenChanged = false;
      }
    });

    this.accountEditForm.controls['userEmailForm'].enable();
    this.accountEditForm.controls['userUsername'].enable();

    this.state = this.initialState();
    this.state.loading = true;
    this.state.editing = true;
  }

  onSubmit(): void {

    this.state.loading = true;

    const user = <UserRequestModel>{
      username: this.accountEditForm.value.userUsername,
      email: this.accountEditForm.value.userEmailForm
    };

    if(user.username !== this.usernameValue){
      this.submitUserUsername(user)
    }

    if(user.email !== this.userEmailValue){
      this.submitUserEmail(user.email)
    }
  }

  submitUserUsername(user: UserRequestModel){
    this.authService.changeUserName(user).subscribe({
      next: (success) => {
        this.snackbar.open(
          "Username changed successfully",
          "",
          {horizontalPosition: 'end', duration: 2000}
        );
        this.state.loading = false;
        this.fetchUserData();
        this.state = this.initialState();
      },
      error: (error) => {
        this.state.loading = false;
        this.snackbar.open("An error occurred, please log in again", "", {horizontalPosition: 'end', duration: 3000});
      }
    })
  }

  submitUserEmail(userEmail: string){
    this.authService.changeUserEmail(userEmail).subscribe({
      next: (success) => {
        this.state.loading = false;
        this.snackbar.open(
          "Email changed successfully",
          "",
          {horizontalPosition: 'end', duration: 2000}
        );

        this.authService.sendVerificationMail()
          .subscribe({
            next: () => {
              this.state.loading = false;
              this.snackbar.open(
                "A verification email has been sent to your email address.",
                "",
                { horizontalPosition: 'end', duration: 6000 }
              );

              this.authService.logout();
            },
            error: () => {
              this.state.loading = false;
              this.snackbar.open(
                "Something went wrong sending email, please try again later",
                "", { horizontalPosition: 'end', duration: 3000 });
              this.router.navigate(['/verify-email'])
            }
          });
      },
      error: (error) => {
        this.state.loading = false;
        this.snackbar.open("An error occurred, please log in again", "", {horizontalPosition: 'end', duration: 3000});
      }
    })
  }

  changePassword(){
    this.authService.sendPassResetMail().subscribe({
      next: () => {
        this.state.loading = false;
        this.snackbar.open(
          "A reset email has been sent to your email address.",
          "",
          { horizontalPosition: 'end', duration: 6000 }
        );

      },
      error: () => {
        this.state.loading = false;
        this.snackbar.open(
          "Something went wrong, please try again later",
          "", { horizontalPosition: 'end', duration: 3000 });
      }
    });

  }

  verify2FA() {
    this.state.loading = true;
    let givenAuthCode = this.twoFAForm.controls['authCode'].value.toString();
    const secret = this._secret;

    this.authService.verify2FA(secret, givenAuthCode).subscribe({
      next: (success) => {
        this.snackbar.open(
          "2FA enabled successfully",
          "",
          {horizontalPosition: 'end', duration: 2000}
        );
        this._twoFAEnabled = true;
        this.state.loading = false;
        this.state = this.initialState();
      },
      error: (error) => {
        this.state.loading = false;
        this.snackbar.open("An error occurred", "", {horizontalPosition: 'end', duration: 3000});
      }
    });
  }

  enable2FA(){
    this.state.enable2FA = true;
    this.twoFAForm.valueChanges.subscribe((formValue) => {
      const authCodeValue = String(this.twoFAForm.controls['authCode'].value);
      const length = authCodeValue.length;
      this.state.valueHasNotBeenChanged = length !== 6 && authCodeValue !== '';
    });
  }

  disable2FA(){
    this.authService.disable2FA().subscribe({
      next: (success) => {
        this.snackbar.open(
          "2FA disabled successfully",
          "",
          {horizontalPosition: 'end', duration: 2000}
        );
        this._twoFAEnabled = false;
        this.state.loading = false;
        this.state = this.initialState();
      },
      error: (error) => {
        this.state.loading = false;
        this.snackbar.open("An error occurred", "", {horizontalPosition: 'end', duration: 3000});
      }
    });
  }

  cancel(): void{
    this.fetchUserData();
    this.state = this.initialState();
  }

  checkLength(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length >= 6 && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }
  get f(): { [key: string]: AbstractControl } {
    return this.accountEditForm.controls;
  }

  get e(): { [key: string]: AbstractControl } {
    return this.twoFAForm.controls;
  }

  get userEmailValue(): string {
    return <string>this.userEmail;
  }

  get usernameValue(): string {
    return this.username;
  }

  get secret(): string {
    return this._secret;
  }

  get twoFAEnabled(): boolean {
    return this._twoFAEnabled;
  }
}
