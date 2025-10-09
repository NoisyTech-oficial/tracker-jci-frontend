import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaLeadsComponent } from './tabela-leads.component';

describe('TabelaLeadsComponent', () => {
  let component: TabelaLeadsComponent;
  let fixture: ComponentFixture<TabelaLeadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabelaLeadsComponent]
    });
    fixture = TestBed.createComponent(TabelaLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
