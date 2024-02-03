import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridColumnActionMenuComponent } from './grid-column-action-menu.component';

describe('GridColumnActionMenuComponent', () => {
  let component: GridColumnActionMenuComponent;
  let fixture: ComponentFixture<GridColumnActionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridColumnActionMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridColumnActionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
