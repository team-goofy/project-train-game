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

interface State {
  loading: boolean;
  error: string | null;
  editting: boolean;
  valueHasNotBeenChanged: boolean;
}

@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private snackbar: MatSnackBar = inject(MatSnackBar);

  accountEditForm: FormGroup = new FormGroup({
    userEmailForm: new FormControl(''),
    userUsername: new FormControl(''),
    userPasswordForm: new FormControl(''),
    userOldPasswordForm: new FormControl(''),
    userNewPasswordForm: new FormControl(''),
    userNewRepeatPasswordForm: new FormControl('')
  });

  private username: string = "";
  private userEmail: string | null  = "";

  state: State;

  constructor() {
    this.state = this.initialState();
  }

  ngOnInit(): void {
    this.fetchUserData();

    this.accountEditForm = this.formBuilder.group(
      {
        userEmailForm: [
          { value: '', disabled: this.state.valueHasNotBeenChanged },
          [
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
        ],
        userPasswordForm: [
          { value: '******', disabled: this.state.valueHasNotBeenChanged },
        ],
        userOldPasswordForm: [
          '',
        ],
        userNewPasswordForm: [
          '',
        ],
        userNewRepeatPasswordForm: [
          '',
        ]
      }
    );

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
    this.accountEditForm.controls['userEmailForm'].disable();
    this.accountEditForm.controls['userUsername'].disable();
    this.accountEditForm.controls['userPasswordForm'].disable();

    this.userEmail = this.authService.getUserData();

    this.authService.getUsername()
      .subscribe({
        next: (data:any) => {
          this.username = data;
          const parsedData = JSON.parse(this.username);
          this.username = parsedData.username;

          this.accountEditForm.controls['userEmailForm'].setValue(this.userEmail);
          this.accountEditForm.controls['userUsername'].setValue(this.username);
        },
        error: () => {
          this.snackbar.open(
            "Something went wrong, please try again later",
            "", { horizontalPosition: 'end', duration: 3000 });
        }
      });
  }

  private initialState(): State {
    return {
      loading: false,
      error: null,
      editting: false,
      valueHasNotBeenChanged: true
    };
  }

  editingState(): void {
    this.accountEditForm.valueChanges.subscribe((formValue) => {
      if(this.accountEditForm.value.userUsername === this.usernameValue && this.accountEditForm.value.userEmailForm === this.userEmailValue){
        this.state.valueHasNotBeenChanged = true;
      }else{
        this.state.valueHasNotBeenChanged = false;
      }

      if(this.accountEditForm.value.userOldPasswordForm != '' &&  this.accountEditForm.value.userNewPasswordForm != '' &&  this.accountEditForm.value.userNewRepeatPasswordForm != ''){
        this.state.valueHasNotBeenChanged = false;
      }
    });

    this.accountEditForm.controls['userEmailForm'].enable();
    this.accountEditForm.controls['userUsername'].enable();
    this.accountEditForm.controls['userPasswordForm'].enable();

    this.state = this.initialState();
    this.state.loading = true;
    this.state.editting = true;

  }

  onSubmit(): void {
    const user = <UserRequestModel>{
      username: this.accountEditForm.value.userUsername,
      email: this.accountEditForm.value.userEmailForm,
      password: this.accountEditForm.value.userPasswordForm
    };

    if(this.accountEditForm.value.userOldPasswordForm != '' &&  this.accountEditForm.value.userNewPasswordForm != '' &&  this.accountEditForm.value.userNewRepeatPasswordForm != ''){
      // userOldPasswordForm === userOldPass
      // if(){
      //   // check of de nieuwe 2 passwords met elkaar overeenkomen, zo niet error
      //   if(this.accountEditForm.value.userNewPasswordForm === this.accountEditForm.value.userNewRepeatPasswordForm){
      //     console.log("wow de wachtwooroden matchen")
      //     this.submitUserPassword()
      //   }else{
      //     //throw error
      //   }
      // }else{
      //   // throw error
      // }
    }

    if(user.username !== this.usernameValue){
      this.submitUserUsername(user)
    }

    if(user.email !== this.userEmailValue){
      this.submitUserEmail(user.email)
    }

  }

  submitUserPassword(){
    this.fetchUserData();
    this.state = this.initialState();
  }

  submitUserUsername(user: UserRequestModel){
    this.authService.changeUserName(user).subscribe({
      next: (success) => {
        let ref = this.snackbar.open(
          "Username changed successfully",
          "",
          {horizontalPosition: 'end', duration: 2000}
        );
        this.fetchUserData();
        this.state = this.initialState();
      },
      error: (error) => {
        this.snackbar.open("The username already exists", "", {horizontalPosition: 'end', duration: 3000});
      }
    })
  }

  submitUserEmail(userEmail: string){
    this.authService.changeUserEmail(userEmail).subscribe({
      next: (success) => {
        let ref = this.snackbar.open(
          "Email changed successfully",
          "",
          {horizontalPosition: 'end', duration: 2000}
        );
        this.fetchUserData();
        this.state = this.initialState();
      },
      error: (error) => {
        this.snackbar.open("The email already exists", "", {horizontalPosition: 'end', duration: 3000});
      }
    })
  }

  cancel(): void{
    this.fetchUserData();
    this.state = this.initialState();
  }


  get f(): { [key: string]: AbstractControl } {
    return this.accountEditForm.controls;
  }

  get userEmailValue(): string {
    return <string>this.userEmail;
  }

  get usernameValue(): string {
    return this.username;
  }

}
