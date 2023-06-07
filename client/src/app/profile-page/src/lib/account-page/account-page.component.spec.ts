import { TestBed, ComponentFixture} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '@client/shared-services';
import { AccountPageComponent } from './account-page.component';
import { MatFormFieldModule } from '@angular/material/form-field'; // Import the MatFormFieldModule

describe('AccountPageComponent', () => {
  let component: AccountPageComponent;
  let fixture: ComponentFixture<AccountPageComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let snackbar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create spy objects for the dependencies
    authService = jasmine.createSpyObj('AuthService', ['getUserData', 'getUsername', 'checkUsername', 'changeUserName', 'changeUserEmail', 'sendVerificationMail', 'sendPassResetMail', 'logout']);
    snackbar = jasmine.createSpyObj('MatSnackBar', ['open']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatFormFieldModule],
      declarations: [AccountPageComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: MatSnackBar, useValue: snackbar },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

});
