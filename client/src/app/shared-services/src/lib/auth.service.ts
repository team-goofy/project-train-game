import { Injectable, inject } from "@angular/core";
import { Auth, authState, idToken, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Router } from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import { HttpClient } from "@angular/common/http";
import { UserRequestModel } from "@client/shared-models";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth: Auth = inject(Auth);
    private router: Router = inject(Router);
    private http: HttpClient = inject(HttpClient);
    user$ = user(this.auth);
    idToken$ = idToken(this.auth);
    error$ = new BehaviorSubject<string | null>(null);

    login(email: string, password: string) {
      signInWithEmailAndPassword(this.auth, email, password)
        .then(() => {
          this.idToken$.subscribe(token => {
            if (token) {
              localStorage.setItem('tokenId', token);
              this.router.navigate(['/']);
            } else {
              this.error$.next('Could not get token');
            }
          });
        })
        .catch((err: Error) => {
          this.error$.next(err.message);
        });
    }

    logout(): void {
        signOut(this.auth);
        localStorage.removeItem('tokenId');
        this.router.navigate(['/']);
    }

    register(userRequestModel: UserRequestModel): Observable<any> {
      return this.http.post('http://localhost:8080/user/register', userRequestModel);
    }
}
