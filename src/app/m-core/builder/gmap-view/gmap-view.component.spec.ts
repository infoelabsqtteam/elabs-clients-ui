import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmapViewComponent } from './gmap-view.component';

describe('GmapViewComponent', () => {
  let component: GmapViewComponent;
  let fixture: ComponentFixture<GmapViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GmapViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GmapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
