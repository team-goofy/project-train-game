import {Component, inject} from '@angular/core';
import { PermissionsService } from "@ng-web-apis/permissions";
import { GeolocationService } from "@ng-web-apis/geolocation";

@Component({
  selector: 'start-location',
  templateUrl: './start-location.component.html',
  styleUrls: ['./start-location.component.scss']
})
export class StartLocationComponent {
  private readonly permissions: PermissionsService = inject(PermissionsService);
  private readonly geoLocation: GeolocationService = inject(GeolocationService);

  constructor() {
    this.checkLocationPermission();
  }

  checkLocationPermission() {
    const geolocationStatus$ = this.permissions.state('geolocation');
  }
}
