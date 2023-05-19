import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoginPageComponent } from "./login-page/login-page.component";
import { LoginPageRoutingModule } from "./login-page-routing.module";
import {BackgroundImageModule} from "@client/shared-components";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    LoginPageRoutingModule,
    BackgroundImageModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule
  ],
    declarations: [
      LoginPageComponent,
    ],
})
export class LoginPageModule {}
