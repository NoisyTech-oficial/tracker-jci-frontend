import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersProcessesComponent } from './filters-processes.component';

describe('FiltersProcessesComponent', () => {
  let component: FiltersProcessesComponent;
  let fixture: ComponentFixture<FiltersProcessesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersProcessesComponent]
    });
    fixture = TestBed.createComponent(FiltersProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
