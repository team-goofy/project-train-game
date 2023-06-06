import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { PermissionsService } from '@ng-web-apis/permissions';
import { StationService } from '../services/station.service';
import { TripService } from '@client/shared-services';
import { StartPageComponent } from './start-page.component';
import { GamePageModule } from '../game-page.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('StartPageComponent', () => {
  let component: StartPageComponent;
  let fixture: ComponentFixture<StartPageComponent>;
  let geolocationServiceSpy: jasmine.SpyObj<GeolocationService>;
  let permissionsServiceSpy: jasmine.SpyObj<PermissionsService>;
  let stationServiceSpy: jasmine.SpyObj<StationService>;
  let tripServiceSpy: jasmine.SpyObj<TripService>;

  beforeEach(() => {
    geolocationServiceSpy = jasmine.createSpyObj('GeolocationService', ['pipe']);
    permissionsServiceSpy = jasmine.createSpyObj('PermissionsService', ['state']);
    stationServiceSpy = jasmine.createSpyObj('StationService', ['init']);
    tripServiceSpy = jasmine.createSpyObj('TripService', ['saveTrip']);

    TestBed.configureTestingModule({
      declarations: [ StartPageComponent ],
      imports: [ GamePageModule, RouterTestingModule ],
      providers: [
        { provide: GeolocationService, useValue: geolocationServiceSpy },
        { provide: PermissionsService, useValue: permissionsServiceSpy },
        { provide: StationService, useValue: stationServiceSpy },
        { provide: TripService, useValue: tripServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StartPageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchLocation', () => {
      spyOn(component, 'fetchLocation');
      component.ngOnInit();
      expect(component.fetchLocation).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from destroy$', () => {
      spyOn(component.destroy$, 'next');
      spyOn(component.destroy$, 'unsubscribe');
      component.ngOnDestroy();
      expect(component.destroy$.next).toHaveBeenCalledWith(true);
      expect(component.destroy$.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('fetchLocation', () => {
    it('should fetch location and initialize station service', () => {
      const position = { coords: { latitude: 1, longitude: 2 } } as GeolocationPosition;
      const permissionState = 'granted' as PermissionState;
      const permissionState$ = of(permissionState);
      const geolocation$ = of(position);

      permissionsServiceSpy.state.and.returnValue(permissionState$);
      geolocationServiceSpy.pipe.and.returnValue(geolocation$);

      component.fetchLocation();
  
      expect(permissionsServiceSpy.state).toHaveBeenCalled();
      expect(geolocationServiceSpy.pipe).toHaveBeenCalled();
      expect(stationServiceSpy.init).toHaveBeenCalledWith(position.coords.latitude, position.coords.longitude);
      expect(component.nearestStation$).not.toBeNull();
      expect(component.state.loading).toBeFalse();
    });

    it('should handle geolocation permission denied error', () => {
      const error = { code: GeolocationPositionError['PERMISSION_DENIED'] } as GeolocationPositionError;
      const permissionState = 'denied';
      const geolocationSubject = new Subject<GeolocationPosition>();
    
      permissionsServiceSpy.state.and.returnValue(of(permissionState));
      geolocationServiceSpy.pipe.and.returnValue(geolocationSubject);
    
      component.fetchLocation();
      geolocationSubject.error(error);

      expect(component.state.permission).toBe(permissionState);
    });

    it('should handle geolocation position unavailable error', () => {
      const error = { code: GeolocationPositionError['POSITION_UNAVAILABLE'] } as GeolocationPositionError;
      const errorMessage = 'Location information is unavailable.';
      const geolocationSubject = new Subject<GeolocationPosition>();
    
      permissionsServiceSpy.state.and.returnValue(of('granted'));
      geolocationServiceSpy.pipe.and.returnValue(geolocationSubject);
    
      component.fetchLocation();
      geolocationSubject.error(error);
    
      expect(component.state.permission).toBeNull();
      expect(component.state.loading).toBeFalse();
      expect(component.state.error).toBe(errorMessage);
    });

    it('should handle geolocation position timeout error', () => {
      const error: GeolocationPositionError =  { code: GeolocationPositionError['TIMEOUT'] } as GeolocationPositionError;
      const errorMessage = 'The request to get user location timed out.';
      const geolocationSubject = new Subject<GeolocationPosition>();
    
      permissionsServiceSpy.state.and.returnValue(of('granted'));
      geolocationServiceSpy.pipe.and.returnValue(geolocationSubject);
    
      component.fetchLocation();
      geolocationSubject.error(error);

      expect(component.state.permission).toBeNull();
      expect(component.state.loading).toBeFalse();
      expect(component.state.error).toBe(errorMessage);
    });

    it('should handle station service errors', () => {
      const error = new Error('Some Error...');
      const errorMessage = 'Something went wrong. Please try again later.';
    
      permissionsServiceSpy.state.and.returnValue(of('granted'));
      stationServiceSpy.init.and.throwError(error);

      component.fetchLocation();

      expect(component.state.permission).toBeNull();
      expect(component.state.loading).toBeFalse();
      expect(component.state.error).toBe(errorMessage);
    });
  });

  describe('initialState', () => {
    it('should return an object with loading set to false, error set to null, and permission set to null', () => {
      expect(component.initialState()).toEqual({ loading: false, error: null, permission: null });
    });
  });
});