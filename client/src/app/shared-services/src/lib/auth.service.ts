import { Injectable, inject } from "@angular/core";
import {
  Auth,
  idToken,
  signInWithEmailAndPassword,
  user,
  getAuth,
  updateEmail
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
    private baseUrl: string = environment.apiUrl;


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

    sendVerificationMail() {
      const httpOptions: Object = {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'text'
      }

      return this.http
        .post<any>(`${this.baseUrl}/mail/send-verification`, this.auth.currentUser!.email, httpOptions)
    }

    checkUsername(username: string): Observable<any> {
      return this.http.get(`${this.baseUrl}/user/username`, { params: { username } });
    }


    getUsername(): Observable<any> {
      const httpOptions: Object = {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'text'
      }
      return this.http.post<any>(`${this.baseUrl}/user/profile`, this.auth.currentUser!.uid, httpOptions);
    }

    isLoggedIn(): boolean {
      return !!localStorage.getItem('tokenId');
    }

//    account-page
  getUserData(): string {
    const currUser = this.auth.currentUser?.email;
    if(currUser){
      return currUser;
    }else{
      throw new TypeError("There is no currentUser");
    }
  }

  changeUserEmail(newUserEmail: string | null | undefined): void{
    if (this.auth.currentUser) {
      //check if userEmail is not null && check if the email is already in use!!
      if (newUserEmail != null) {
        updateEmail(this.auth.currentUser, newUserEmail).then(() => {
          return;
        }).catch((error) => {
          // An error occurred
          // ...
          return;
        });
      }
    }
  }


}
