import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiDownloadModalComponent } from './multi-download-modal.component';

describe('MultiDownloadModalComponent', () => {
  let component: MultiDownloadModalComponent;
  let fixture: ComponentFixture<MultiDownloadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiDownloadModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiDownloadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
