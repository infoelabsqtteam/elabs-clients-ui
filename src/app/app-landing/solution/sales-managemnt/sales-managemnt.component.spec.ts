import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesManagemntComponent } from './sales-managemnt.component';

describe('SalesManagemntComponent', () => {
  let component: SalesManagemntComponent;
  let fixture: ComponentFixture<SalesManagemntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesManagemntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesManagemntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
