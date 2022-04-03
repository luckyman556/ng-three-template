import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Object3dEditComponent } from './object3d-edit.component';

describe('Object3dEditComponent', () => {
  let component: Object3dEditComponent;
  let fixture: ComponentFixture<Object3dEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Object3dEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Object3dEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
