import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffHtmlComponent } from './diff-html.component';

describe('DiffHtmlComponent', () => {
  let component: DiffHtmlComponent;
  let fixture: ComponentFixture<DiffHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiffHtmlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
