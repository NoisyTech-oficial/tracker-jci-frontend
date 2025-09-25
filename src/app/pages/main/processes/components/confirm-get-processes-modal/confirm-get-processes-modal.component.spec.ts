import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmGetProcessesModalComponent } from './confirm-get-processes-modal.component';

describe('ConfirmGetProcessesModalComponent', () => {
  let component: ConfirmGetProcessesModalComponent;
  let fixture: ComponentFixture<ConfirmGetProcessesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmGetProcessesModalComponent]
    });
    fixture = TestBed.createComponent(ConfirmGetProcessesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
