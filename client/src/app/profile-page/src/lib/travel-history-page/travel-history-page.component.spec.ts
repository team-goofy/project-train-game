import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelHistoryPageComponent } from './travel-history-page.component';

describe('TravelHistoryPageComponent', () => {
  let component: TravelHistoryPageComponent;
  let fixture: ComponentFixture<TravelHistoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelHistoryPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
