import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AyurvedicFormComponent } from './ayurvedic-form.component';

describe('AyurvedicFormComponent', () => {
  let component: AyurvedicFormComponent;
  let fixture: ComponentFixture<AyurvedicFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AyurvedicFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AyurvedicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
