import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDisabledComponent } from './user-disabled.component';

describe('UserDisabledComponent', () => {
  let component: UserDisabledComponent;
  let fixture: ComponentFixture<UserDisabledComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserDisabledComponent]
    });
    fixture = TestBed.createComponent(UserDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
