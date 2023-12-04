import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CheckboxMenuComponent } from "./checkbox-menu.component";

describe("CheckboxMenuComponent", () => {
  let component: CheckboxMenuComponent;
  let fixture: ComponentFixture<CheckboxMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
