import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatepwdComponent } from './createpwd.component';

describe('CreatepwdComponent', () => {
  let component: CreatepwdComponent;
  let fixture: ComponentFixture<CreatepwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatepwdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatepwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
