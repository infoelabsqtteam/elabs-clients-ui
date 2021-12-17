import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TemplateModalComponent } from './template-modal.component';

describe('TemplateModalComponent', () => {
  let component: TemplateModalComponent;
  let fixture: ComponentFixture<TemplateModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
