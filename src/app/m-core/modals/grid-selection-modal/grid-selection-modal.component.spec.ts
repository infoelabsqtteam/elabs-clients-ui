import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GridSelectionModalComponent } from './grid-selection-modal.component';

describe('GridSelectionModalComponent', () => {
  let component: GridSelectionModalComponent;
  let fixture: ComponentFixture<GridSelectionModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GridSelectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridSelectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
