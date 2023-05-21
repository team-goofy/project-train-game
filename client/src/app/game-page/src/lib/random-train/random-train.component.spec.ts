import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RandomTrainComponent } from "./random-train.component";

describe('RandomTrainComponent', () => {
  let component: RandomTrainComponent;
  let fixture: ComponentFixture<RandomTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomTrainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandomTrainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
