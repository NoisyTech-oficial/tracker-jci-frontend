import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessesObtainedComponent } from './processes-obtained.component';

describe('ProcessesObtainedComponent', () => {
  let component: ProcessesObtainedComponent;
  let fixture: ComponentFixture<ProcessesObtainedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessesObtainedComponent]
    });
    fixture = TestBed.createComponent(ProcessesObtainedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
