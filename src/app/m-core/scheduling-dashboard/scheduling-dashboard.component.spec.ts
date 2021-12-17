import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchedulingDashboardComponent } from './scheduling-dashboard.component';

describe('SchedulingDashboardComponent', () => {
  let component: SchedulingDashboardComponent;
  let fixture: ComponentFixture<SchedulingDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulingDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
