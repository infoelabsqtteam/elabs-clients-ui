import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PharmaFormComponent } from './pharma-form.component';

describe('PharmaFormComponent', () => {
  let component: PharmaFormComponent;
  let fixture: ComponentFixture<PharmaFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
