import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineFormViewComponent } from './inline-form-view.component';

describe('InlineFormViewComponent', () => {
  let component: InlineFormViewComponent;
  let fixture: ComponentFixture<InlineFormViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InlineFormViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
