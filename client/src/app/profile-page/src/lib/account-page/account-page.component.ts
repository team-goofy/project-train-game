import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, delay, filter, switchMap, take, tap} from "rxjs/operators";
import {EMPTY} from "rxjs";

interface State {
  loading: boolean;
  error: string | null;
  editting: boolean;
  disabled: boolean;
}


@Component({
  selector: 'app-account-page',
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPageComponent {
  private formBuilder: FormBuilder = inject(FormBuilder);
  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  state: State;

  constructor() {
    this.state = this.initialState();
  }

  edittingState(): void {
    this.state = this.initialState();
    this.state.loading = true;
    this.state.editting = true;
    this.state.disabled = false;
    console.log(this.state);

    // this._permissionService.state('geolocation').pipe(
    //   tap((state: PermissionState) => this.state.permission = state),
    //   filter((state: PermissionState) => state === 'granted'),
    //   switchMap(() => this._geoLocationService.pipe(take(1))),
    //   catchError((error: GeolocationPositionError) => {
    //     this.state = this.initialState();
    //
    //     if (error.code === error.PERMISSION_DENIED) {
    //       this.state.permission = 'denied';
    //     } else if (error.code === error.POSITION_UNAVAILABLE) {
    //       this.state.error = 'Location information is unavailable.';
    //     } else if (error.code === error.TIMEOUT) {
    //       this.state.error = 'The request to get user location timed out.';
    //     }
    //
    //     return EMPTY;
    //   }),
    //   delay(1000),
    //   tap((position: GeolocationPosition) => {
    //     this._stationService.init(position.coords.latitude, position.coords.longitude)
    //     this.state.loading = false;
    //   }),
    //   catchError(() => {
    //     this.state = this.initialState();
    //     this.state.error = 'Something went wrong. Please try again later.';
    //     return EMPTY;
    //   })
    // ).subscribe();
  }



  private initialState(): State {
    return {
      loading: false,
      error: null,
      editting: false,
      disabled: true
    };
  }


  ngOnInit(): void {
    this.form = this.formBuilder.group(
      {
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}/i)
          ]
        ],
        password: [
          '',
          [
            Validators.required,
          ],
        ],
      }
    )
  }


  onSubmit(): void {
    this.state = this.initialState();
    console.log('submit form')
  }

}
