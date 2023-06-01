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
    userPasswordForm: new FormControl('')
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
    this.accountEditForm.controls['userEmailForm'].enable();
    this.accountEditForm.controls['userUsername'].enable();
    this.accountEditForm.controls['userPasswordForm'].enable();

    this.state = this.initialState();
    this.state.loading = true;
    this.state.editting = true;

    //check if user made any changes and then enable the submit btn

  }

  private initialState(): State {
    return {
      loading: false,
      error: null,
      editting: false
    };
  }

  onSubmit(): void {
    const user = <UserRequestModel>{
      username: this.accountEditForm.value.userUsername,
      email: this.accountEditForm.value.userEmailForm,
      password: this.accountEditForm.value.userPasswordForm
    };

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

  get userEmailValue(): string {
    return <string>this.userEmail;
  }

  get usernameValue(): string {
    return this.username;
  }

}
