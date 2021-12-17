import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CareerWithUsComponent } from './career-with-us.component';

describe('CareerWithUsComponent', () => {
  let component: CareerWithUsComponent;
  let fixture: ComponentFixture<CareerWithUsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CareerWithUsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerWithUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
