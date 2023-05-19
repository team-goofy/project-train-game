import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { RegisterPageRoutingModule } from "./register-page-routing.module";
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { BackgroundImageModule } from "@client/shared-components";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  imports: [
    CommonModule,
    RegisterPageRoutingModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    BackgroundImageModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
    declarations: [
      RegisterPageComponent,
    ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' }}
  ]
})
export class RegisterPageModule {}
