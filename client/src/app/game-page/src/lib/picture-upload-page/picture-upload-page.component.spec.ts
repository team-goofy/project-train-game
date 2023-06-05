import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PictureUploadPageComponent } from "./picture-upload-page.component";

describe('RandomTrainComponent', () => {
  let component: PictureUploadPageComponent;
  let fixture: ComponentFixture<PictureUploadPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PictureUploadPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PictureUploadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
