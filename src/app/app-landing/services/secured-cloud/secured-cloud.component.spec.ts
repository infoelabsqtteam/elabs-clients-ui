import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuredCloudComponent } from './secured-cloud.component';

describe('SecuredCloudComponent', () => {
  let component: SecuredCloudComponent;
  let fixture: ComponentFixture<SecuredCloudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecuredCloudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuredCloudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
