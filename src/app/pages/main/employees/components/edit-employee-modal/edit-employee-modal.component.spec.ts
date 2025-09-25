import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeeModalComponent } from './edit-employee-modal.component';

describe('EditEmployeeModalComponent', () => {
  let component: EditEmployeeModalComponent;
  let fixture: ComponentFixture<EditEmployeeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEmployeeModalComponent]
    });
    fixture = TestBed.createComponent(EditEmployeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
