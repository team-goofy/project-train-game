import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationPageComponent } from './verification-page.component';

describe('RegisterPageComponent', () => {
  let component: VerificationPageComponent;
  let fixture: ComponentFixture<VerificationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificationPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
