import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { InterceptorService } from '@client/shared-services';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {AngularFireAuthGuardModule} from "@angular/fire/compat/auth-guard";
import {FIREBASE_OPTIONS} from "@angular/fire/compat";
import {AuthGuardModule} from "@angular/fire/auth-guard";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireAuthGuardModule,
    AuthGuardModule,
    AppRoutingModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth())
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    {
      provide: FIREBASE_OPTIONS,
      useValue: environment.firebase
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
