/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CommonGridComponent } from './common-grid.component';

describe('CommonGridComponent', () => {
  let component: CommonGridComponent;
  let fixture: ComponentFixture<CommonGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
