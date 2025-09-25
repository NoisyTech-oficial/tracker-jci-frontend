import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeMoreInformationsProcessesModalComponent } from './see-more-informations-processes-modal.component';

describe('SeeMoreInformationsProcessesModalComponent', () => {
  let component: SeeMoreInformationsProcessesModalComponent;
  let fixture: ComponentFixture<SeeMoreInformationsProcessesModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeeMoreInformationsProcessesModalComponent]
    });
    fixture = TestBed.createComponent(SeeMoreInformationsProcessesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
