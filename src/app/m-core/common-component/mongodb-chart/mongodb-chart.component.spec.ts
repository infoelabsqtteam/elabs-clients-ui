/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MongodbChartComponent } from './mongodb-chart.component';

describe('MongodbChartComponent', () => {
  let component: MongodbChartComponent;
  let fixture: ComponentFixture<MongodbChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MongodbChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MongodbChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
