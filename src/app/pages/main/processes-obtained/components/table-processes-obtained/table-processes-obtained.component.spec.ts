import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProcessesObtainedComponent } from './table-processes-obtained.component';

describe('TableProcessesObtainedComponent', () => {
  let component: TableProcessesObtainedComponent;
  let fixture: ComponentFixture<TableProcessesObtainedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableProcessesObtainedComponent]
    });
    fixture = TestBed.createComponent(TableProcessesObtainedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
