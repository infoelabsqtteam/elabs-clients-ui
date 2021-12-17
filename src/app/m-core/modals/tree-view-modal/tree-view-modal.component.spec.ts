import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TreeViewModalComponent } from './tree-view-modal.component';

describe('TreeViewModalComponent', () => {
  let component: TreeViewModalComponent;
  let fixture: ComponentFixture<TreeViewModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeViewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
