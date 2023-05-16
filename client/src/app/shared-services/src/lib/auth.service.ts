import { Injectable, inject } from "@angular/core";
import { Auth, idToken, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Router } from "@angular/router";
import {catchError, from, Observable, switchMap, tap, throwError} from "rxjs";
import { HttpClient } from "@angular/common/http";
import { UserRequestModel } from "@client/shared-models";
import { environment } from "../../../../environments/environment";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {UserLoginModel} from "../../../shared-models/src/lib/user-login.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth: Auth = inject(Auth);
    private router: Router = inject(Router);
    private http: HttpClient = inject(HttpClient);
    private afs: AngularFireAuth = inject(AngularFireAuth);
    private baseUrl: String = environment.apiUrl;

    user$ = user(this.auth);
    idToken$ = idToken(this.auth);


    login(user: UserLoginModel): Observable<any> {
      return from(signInWithEmailAndPassword(this.auth, user.email, user.password))
        .pipe(
          switchMap(() => this.idToken$),
          tap(token => {
            if (token) {
              localStorage.setItem('tokenId', token);
            } else {
              throw new Error('Could not get token');
            }
          }),
          catchError((err: Error) => {
            return throwError(err);
          })
        );
    }

    logout(): void {
        signOut(this.auth);
        localStorage.removeItem('tokenId');
        // this.router.navigate(['/']);
    }

    register(userRequestModel: UserRequestModel): Observable<any> {
      return this.http.post(`${this.baseUrl}/user/register`, userRequestModel);
    }

    checkUsername(username: string): Observable<any> {
      return this.http.get(`${this.baseUrl}/user/username`, { params: { username } });
    }
}
