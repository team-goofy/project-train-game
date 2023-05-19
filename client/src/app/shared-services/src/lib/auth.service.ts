import { Injectable, inject } from "@angular/core";
import {
  Auth,
  idToken,
  signInWithEmailAndPassword,
  user
} from '@angular/fire/auth';
import { Router } from "@angular/router";
import {catchError, from, Observable, switchMap, tap, throwError} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserLoginModel, UserRequestModel} from "@client/shared-models";
import { environment } from "../../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth: Auth = inject(Auth);
    private router: Router = inject(Router);
    private http: HttpClient = inject(HttpClient);
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
        this.auth.signOut().then(() => {
          localStorage.removeItem('tokenId');
          this.router.navigate(['/']);
        });
    }

    register(userRequestModel: UserRequestModel): Observable<any> {
      return this.http.post(`${this.baseUrl}/user/register`, userRequestModel);
    }

    sendVerificationMail(emailParam: string | null) {
      const email = emailParam ? emailParam : this.auth.currentUser!.email;

      const httpOptions: Object = {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'text'
      }

      return this.http
        .post<any>(`${this.baseUrl}/mail/send-verification`, email, httpOptions)
    }

    checkUsername(username: string): Observable<any> {
      return this.http.get(`${this.baseUrl}/user/username`, { params: { username } });
    }

    isLoggedIn(): boolean {
      return !!localStorage.getItem('tokenId');
    }
}
