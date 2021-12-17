import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortcutinfoComponent } from './shortcutinfo.component';

describe('ShortcutinfoComponent', () => {
  let component: ShortcutinfoComponent;
  let fixture: ComponentFixture<ShortcutinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShortcutinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
