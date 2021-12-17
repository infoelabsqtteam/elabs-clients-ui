import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineInterfaceComponent } from './machine-interface.component';

describe('MachineInterfaceComponent', () => {
  let component: MachineInterfaceComponent;
  let fixture: ComponentFixture<MachineInterfaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineInterfaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
