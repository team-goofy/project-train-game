import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@client/shared-services";
import { UserRequestModel } from "@client/shared-models";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

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

  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}", "i"))
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
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const user = <UserRequestModel>{
      username: this.form.value.username,
      email: this.form.value.email,
      password: this.form.value.password
    };

    this.authService.register(user).subscribe({
      next: () => {
        let ref = this.snackbar.open(
          "Account has been created successfully",
          "",
          { horizontalPosition: 'end', duration: 3000 }
        );

        ref.afterDismissed().subscribe(() => {
          this.router.navigate(['/login']);
        });
      },
      error: ({ error }) => {
        this.snackbar.open(error.errors.join(), "Close");
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
