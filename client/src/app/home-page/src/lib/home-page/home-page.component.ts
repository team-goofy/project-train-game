import {Component, inject} from '@angular/core';
import { AuthService } from "@client/shared-services";

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  private authService: AuthService = inject(AuthService);
  loginStatus: boolean | undefined;

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((status) => {
      this.loginStatus = status;
    });
  }
  logout(): void {
    this.authService.logout();
  }

  scrollTo(target: HTMLDivElement) {
    target.scrollIntoView({behavior: 'smooth'});
  }
}
