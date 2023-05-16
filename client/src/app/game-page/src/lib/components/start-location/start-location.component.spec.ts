import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartLocationComponent } from './start-location.component';

describe('StartLocationComponent', () => {
  let component: StartLocationComponent;
  let fixture: ComponentFixture<StartLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
