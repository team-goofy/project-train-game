import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LoginPageComponent } from "./login-page/login-page.component";
import { LoginPageRoutingModule } from "./login-page-routing.module";

@NgModule({
    imports: [
      CommonModule,
      LoginPageRoutingModule
    ],
    declarations: [
      LoginPageComponent,
    ],
})
export class LoginPageModule {}
