import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "@client/shared-services";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserRequestModel} from "@client/shared-models";
// import { getAuth } from "firebase/auth";

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
  private authService: AuthService = inject(AuthService);
  private snackbar: MatSnackBar = inject(MatSnackBar);

  accountEditForm = new FormGroup({
    userEmailForm: new FormControl(''),
    userUsername: new FormControl(''),
    userPasswordForm: new FormControl('*******'),
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

  private initialState(): State {
    return {
      loading: false,
      error: null,
      editting: false,
      valueHasNotBeenChanged: true
    };
  }

  onSubmit(): void {
    const user = <UserRequestModel>{
      username: this.accountEditForm.value.userUsername,
      email: this.accountEditForm.value.userEmailForm,
      password: this.accountEditForm.value.userPasswordForm
    };

    if(user.username !== this.usernameValue){
      this.authService.changeUserName(user).subscribe({
        next: (success) => {
          console.log()
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

    if(user.email !== this.userEmailValue){
      this.authService.changeUserEmail(user.email).subscribe({
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
    this.fetchUserData();
    this.state = this.initialState();

  }

  cancel(): void{
    this.fetchUserData();
    this.state = this.initialState();
  }

  get userEmailValue(): string {
    return <string>this.userEmail;
  }

  get usernameValue(): string {
    return this.username;
  }

}
