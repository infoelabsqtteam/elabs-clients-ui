import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTableViewComponent } from './grid-table-view.component';

describe('GridTableViewComponent', () => {
  let component: GridTableViewComponent;
  let fixture: ComponentFixture<GridTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridTableViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
