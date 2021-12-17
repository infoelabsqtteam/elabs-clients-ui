/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MoveFileFolderComponent } from './move-file-folder.component';

describe('MoveFileFolderComponent', () => {
  let component: MoveFileFolderComponent;
  let fixture: ComponentFixture<MoveFileFolderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveFileFolderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveFileFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
