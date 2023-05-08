import { Injectable, inject } from "@angular/core";
import { Auth, UserCredential, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth: Auth = inject(Auth);
    private router: Router = inject(Router);

    user$ = user(this.auth);
    error$ = new BehaviorSubject<string | null>(null);

    login(email: string, password: string) {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((res: UserCredential) => {
          res.user.getIdToken().then(token => {
            localStorage.setItem('tokenId', token);
            this.router.navigate(['/']);
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
}