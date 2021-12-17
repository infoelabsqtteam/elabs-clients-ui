import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddOrderModalComponent } from './add-order-modal.component';

describe('AddOrderModalComponent', () => {
  let component: AddOrderModalComponent;
  let fixture: ComponentFixture<AddOrderModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOrderModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
