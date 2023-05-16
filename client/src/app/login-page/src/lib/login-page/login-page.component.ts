import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@client/shared-services";
import { UserRequestModel } from "@client/shared-models";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { debounceTime, distinctUntilChanged } from "rxjs";

@Component({
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit{
  private formBuilder: FormBuilder = inject(FormBuilder);
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl('')
  });
  submitted = false;
  hide = true;
  viewPass() {
    this.hide = !this.hide;
  }

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(6)])
      }
    )


    // this.form = this.formBuilder.group(
    //   {
    //     email: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.pattern(new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}", "i"))
    //       ]
    //     ],
    //     username: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.minLength(4),
    //         Validators.maxLength(25),
    //       ],
    //     ],
    //     password: [
    //       '',
    //       [
    //         Validators.required,
    //         Validators.minLength(6),
    //         Validators.maxLength(40),
    //       ],
    //     ],
    //   }
    // );
  }
  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

  }

}
