import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SortTestComponent } from './sort-test.component';

describe('SortTestComponent', () => {
  let component: SortTestComponent;
  let fixture: ComponentFixture<SortTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SortTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
