import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraInfoComponent } from './camera-info.component';

describe('CameraInfoComponent', () => {
  let component: CameraInfoComponent;
  let fixture: ComponentFixture<CameraInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
