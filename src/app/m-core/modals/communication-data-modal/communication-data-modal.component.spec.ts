import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationDataModalComponent } from './communication-data-modal.component';

describe('CommunicationDataModalComponent', () => {
  let component: CommunicationDataModalComponent;
  let fixture: ComponentFixture<CommunicationDataModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicationDataModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationDataModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
