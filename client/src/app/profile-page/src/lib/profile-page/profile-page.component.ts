import {Component, inject} from '@angular/core';
import {AuthService} from "@client/shared-services";

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent {
  authService: AuthService = inject(AuthService);

  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }
}
