import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BisFormComponent } from './bis-form.component';

describe('BisFormComponent', () => {
  let component: BisFormComponent;
  let fixture: ComponentFixture<BisFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BisFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
