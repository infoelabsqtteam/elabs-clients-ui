import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingFunctionsModalComponent } from './landing-functions-modal.component';

describe('LandingFunctionsModalComponent', () => {
  let component: LandingFunctionsModalComponent;
  let fixture: ComponentFixture<LandingFunctionsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingFunctionsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingFunctionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
