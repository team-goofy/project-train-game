import {Component, inject} from '@angular/core';
import { AuthService } from "@client/shared-services";

@Component({
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  authService: AuthService = inject(AuthService);

  scrollTo(target: HTMLDivElement) {
    target.scrollIntoView({behavior: 'smooth'});
  }
}
