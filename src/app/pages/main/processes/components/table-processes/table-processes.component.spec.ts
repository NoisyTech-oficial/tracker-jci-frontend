import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProcessesComponent } from './table-processes.component';

describe('TableProcessesComponent', () => {
  let component: TableProcessesComponent;
  let fixture: ComponentFixture<TableProcessesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableProcessesComponent]
    });
    fixture = TestBed.createComponent(TableProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
