import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApedaFormatComponent } from './apeda-format.component';

describe('ApedaFormatComponent', () => {
  let component: ApedaFormatComponent;
  let fixture: ComponentFixture<ApedaFormatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApedaFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApedaFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
