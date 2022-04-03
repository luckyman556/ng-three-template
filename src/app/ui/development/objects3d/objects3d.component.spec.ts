import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Objects3dComponent } from './objects3d.component';

describe('Objects3dComponent', () => {
  let component: Objects3dComponent;
  let fixture: ComponentFixture<Objects3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Objects3dComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Objects3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
