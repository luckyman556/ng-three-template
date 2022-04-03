import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevelopmentMainComponent } from './development-main.component';

describe('DevelopmentMainComponent', () => {
  let component: DevelopmentMainComponent;
  let fixture: ComponentFixture<DevelopmentMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevelopmentMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevelopmentMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
