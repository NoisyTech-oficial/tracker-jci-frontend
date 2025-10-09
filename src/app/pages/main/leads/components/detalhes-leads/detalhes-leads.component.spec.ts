import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DetalhesLeadsComponent } from './detalhes-leads.component';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { MasksService } from 'src/app/shared/masks/masks.service';
import { LeadDetailsService } from 'src/app/services/lead-details/lead-details.service';

const activatedRouteMock = {
  snapshot: {
    paramMap: {
      get: () => '1'
    }
  }
};

const processesServiceMock = {
  getDetalhesLeads: () => of({
    nome: 'Teste',
    banco: 'Banco',
    processo_assunto: 'Assunto',
    processo_classe: 'Classe',
    processo_foro: 'Foro',
    processo_vara: 'Vara',
    processo_juiz: 'Juiz',
    processo_distribuicao: '2024-01-01T00:00:00.000Z',
    processo_valor_acao: '1000',
    processo_requerente: 'Requerente',
    processo_advogado_requerente: 'Advogado',
    processo_movimentacoes: [],
    processo_documentos: []
  })
};

const masksServiceMock = {
  formatCurrency: () => 'R$ 1.000,00',
  getFormatDateToLabel: () => '01/01/2024',
  formatDocument: () => '000.000.000-00',
  formatPhone: () => '+55 11 99999-9999'
};

class LeadDetailsServiceStub extends LeadDetailsService {
  override getLead() {
    return null;
  }
}

describe('DetalhesLeadsComponent', () => {
  let component: DetalhesLeadsComponent;
  let fixture: ComponentFixture<DetalhesLeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetalhesLeadsComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ProcessesService, useValue: processesServiceMock },
        { provide: MasksService, useValue: masksServiceMock },
        { provide: LeadDetailsService, useClass: LeadDetailsServiceStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DetalhesLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
