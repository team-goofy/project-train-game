import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { AuthService } from "@client/shared-services";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import {UserLoginModel} from "@client/shared-models";
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
  private destroy$: Subject<boolean> = new Subject<boolean>();

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  submitted = false;
  showPassword = true;

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

    this.authService.login(user)
    .pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.snackbar.open(
          "Logged in successfully",
          "",
          { horizontalPosition: 'end', duration: 2000 }
        );

        this.router.navigate(['/']);
      },
      error: () => {
        this.snackbar.open("Something went wrong, please try again", "", { horizontalPosition: 'end', duration: 3000 });
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
}
