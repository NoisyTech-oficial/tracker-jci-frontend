import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeMoreInformationsProcessesObtainedModalComponent } from './see-more-informations-processes-obtained-modal.component';

describe('SeeMoreInformationsProcessesObtainedModalComponent', () => {
  let component: SeeMoreInformationsProcessesObtainedModalComponent;
  let fixture: ComponentFixture<SeeMoreInformationsProcessesObtainedModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeeMoreInformationsProcessesObtainedModalComponent]
    });
    fixture = TestBed.createComponent(SeeMoreInformationsProcessesObtainedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
