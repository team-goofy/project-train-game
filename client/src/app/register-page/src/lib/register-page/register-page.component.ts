import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@client/shared-services";
import { UserRequestModel } from "@client/shared-models";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { debounceTime, distinctUntilChanged } from "rxjs";

@Component({
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit{
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private snackbar: MatSnackBar = inject(MatSnackBar);

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    username: new FormControl(''),
    password: new FormControl('')
  });
  submitted = false;
  success = false;

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
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(25),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
      }
    );

    this.form.controls['username'].valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe({
      next: (value: string) => {
        this.authService.checkUsername(value).subscribe({
          next: (exists: boolean) => {
            if (exists) {
              this.form.controls['username'].setErrors({ usernameExists: true });
            }
          }
        });
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      this.submitted = false;
      return;
    }

    const user = <UserRequestModel>{
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.authService.register(user).subscribe({
      next: () => {
        this.success = true;

       this.snackbar.open(
          "Account has been created successfully! Check your mail to verify your account.",
          "",
          { horizontalPosition: 'end', duration: 6000 }
        );

        this.router.navigate(['/login']);
      },
      error: ({ error }) => {
        this.submitted = false;
        this.snackbar.open(error.errors.join(), "Close");
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
