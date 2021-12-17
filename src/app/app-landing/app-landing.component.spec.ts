import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppLandingComponent } from './app-landing.component';

describe('ElabLandingComponent', () => {
  let component: AppLandingComponent;
  let fixture: ComponentFixture<AppLandingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
