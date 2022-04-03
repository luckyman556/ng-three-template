import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatPopupComponent } from './flat-popup.component';

describe('FlatPopupComponent', () => {
  let component: FlatPopupComponent;
  let fixture: ComponentFixture<FlatPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
