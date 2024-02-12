import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EicFormatComponent } from './eic-format.component';

describe('EicFormatComponent', () => {
  let component: EicFormatComponent;
  let fixture: ComponentFixture<EicFormatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EicFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EicFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
