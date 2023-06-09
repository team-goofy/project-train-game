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
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {UserLoginModel, UserRequestModel, Stats} from "@client/shared-models";
import { environment } from "../../../../environments/environment";
import {User} from "firebase/auth";
import {AchievementStats} from "../../../shared-models/src/lib/achievement-stats.model";
import {AchievementUser} from "../../../shared-models/src/lib/achievement-user.model";

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

  getUserCollectionData(): Observable<any> {
      const httpOptions: Object = {
        headers: new HttpHeaders().set('Content-Type', 'application/json'),
        responseType: 'text'
      }
      return this.http.post<any>(`${this.baseUrl}/user/profile`, this.auth.currentUser!.uid, httpOptions);
    }

  getUserCollectionDataWithoutLogin(uid: string): Observable<any> {
    const httpOptions: Object = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    }
    return this.http.post<any>(`${this.baseUrl}/user/profile`, uid, httpOptions);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('tokenId');
  }

  getUidByEmail(email: string): Observable<{uid: string}> {
    return this.http.get<{uid: string}>(`${this.baseUrl}/user/twofacheck`, {params: {email}});
  }

//    account-page
  getUserData(): User {
    const currUser = this.auth.currentUser;

    if (currUser) {
      return currUser;
    } else{
      throw new TypeError("There is no currentUser");
    }
  }

  changeUserName(userRequestModel: UserRequestModel): Observable<any>{
    const httpOptions: Object = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    }

    let username = userRequestModel.username;
    return this.http.put<any>(`${this.baseUrl}/user/profileUsername`, username, httpOptions);
  }

  verify2FA(secret: string, code: string): Observable<any> {
    const httpOptions: Object = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    }

    const body = {
      secret: secret,
      code: code
    };

    return this.http.put<any>(`${this.baseUrl}/auth/verify2FA`, body, httpOptions);
  }

  verify2FALogin(secret: string, code: string, uid: string): Observable<any> {
    const httpOptions: Object = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    }

    const body = {
      secret: secret,
      code: code,
      uid: uid
    };

    return this.http.put<any>(`${this.baseUrl}/auth/verify2falogin`, body, httpOptions);
  }

  disable2FA(): Observable<any> {
    const httpOptions: Object = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text',
    }

    return this.http.put<any>(`${this.baseUrl}/auth/disable2FA`, this.auth.currentUser!.uid ,httpOptions);
  }

  changeUserEmail(newUserEmail: string): Observable<any> {
    if (this.auth.currentUser) {
      if (newUserEmail != null && newUserEmail !== this.auth.currentUser.email) {
        return new Observable((observer) => {
          if (this.auth.currentUser) {
            updateEmail(this.auth.currentUser, newUserEmail)
              .then(() => {
                observer.next(); // Emit a value to complete the Observable
                observer.complete(); // Complete the Observable
              })
              .catch((error) => {
                observer.error(error); // Emit an error to the Observable
              });
          }
        });
      } else {
        return new Observable((observer) => {
          observer.next(); // Emit a value to complete the Observable
          observer.complete(); // Complete the Observable
        });
      }
    } else {
      return new Observable((observer) => {
        observer.next(); // Emit a value to complete the Observable
        observer.complete(); // Complete the Observable
      });
    }
  }

  sendPassResetMail() {
    const httpOptions: Object = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    }

    return this.http
      .post<any>(`${this.baseUrl}/mail/sendPassReset`, this.auth.currentUser!.email, httpOptions)
  }

  getStatsByUid(): Observable<Stats> {
    return this.http.get<Stats>(`${this.baseUrl}/stats`,
      { params: { uid: this.auth.currentUser!.uid } });
  }

  updateStats(totalDuration: number): Observable<Stats> {
    const httpOptions: Object = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    return this.http.put<Stats>(`${this.baseUrl}/stats`, totalDuration, httpOptions);
  }

  getUsersAchievements(): Observable<AchievementUser[]> {
    return this.http.get<AchievementUser[]>(`${this.baseUrl}/achievements`,
      { params: { uid: this.auth.currentUser!.uid } });
  }

  updateUsersAchievements(achievementStats: AchievementStats): Observable<string> {
    const httpOptions: Object = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    }

    return this.http.put<string>(`${this.baseUrl}/achievements`, achievementStats, httpOptions);
  }
}
