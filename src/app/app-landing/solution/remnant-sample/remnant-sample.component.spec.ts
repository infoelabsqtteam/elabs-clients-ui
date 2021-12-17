/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RemnantSampleComponent } from './remnant-sample.component';

describe('RemnantSampleComponent', () => {
  let component: RemnantSampleComponent;
  let fixture: ComponentFixture<RemnantSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemnantSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemnantSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
