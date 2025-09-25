import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersProcessesObtainedComponent } from './filters-processes-obtained.component';

describe('FiltersProcessesObtainedComponent', () => {
  let component: FiltersProcessesObtainedComponent;
  let fixture: ComponentFixture<FiltersProcessesObtainedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersProcessesObtainedComponent]
    });
    fixture = TestBed.createComponent(FiltersProcessesObtainedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
