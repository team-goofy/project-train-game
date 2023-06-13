import { Component, inject } from '@angular/core';
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

  }

  get e(): { [key: string]: AbstractControl } {
    return this.twoFAForm.controls;
  }

}
