import { Component, OnInit } from '@angular/core';
import { ConfiguracoesService } from 'src/app/services/configuracoes/configuracoes.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { UserService } from 'src/app/services/user/user.service';
import { Header } from 'src/app/shared/interfaces/header.interface';

type LeadAssignmentType = 'manual' | 'sorteio' | 'aleatorio';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent implements OnInit {
    header: Header = { title: 'Configurações', subtitle: 'Definições do seu sistema' };
    // userData: UserData = this.userService.getUserData();

    activeTab: 'status' | 'leads' | 'advogado' = 'status';
    defaultLeadAssignment: LeadAssignmentType = 'manual';
    leadAssignmentType: LeadAssignmentType = this.defaultLeadAssignment;
    leadAssignmentOptions: Array<{ value: LeadAssignmentType; label: string; description: string }> = [
      {
        value: 'manual',
        label: 'Manual',
        description: 'Você decide manualmente quem receberá cada lead.'
      },
      {
        value: 'aleatorio',
        label: 'Aleatório',
        description: 'Atribuição automática com distribuição equilibrada e imprevisível.'
      },
      {
        value: 'sorteio',
        label: 'Por sorteio',
        description: 'Cada novo lead é distribuído por sorteio entre a equipe.'
      }
    ];

    constructor(
      private configuracoesService: ConfiguracoesService,
      private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
      this.getConfiguracoes();
    }

    getConfiguracoes() {
      this.configuracoesService.getConfiguracoes('DISTRIBUICAO_LEADS').subscribe(
        (res) => {
          this.leadAssignmentType = this.converterDistribuicao(res.valor);
        }, 
        (error) => {
          this.notificationService.showMessage('Não foi possivel obter a configuração de leads', 'error')
        }
      );
    }

    converterDistribuicao(valor: string): LeadAssignmentType {
      const mapa = {
        MANUAL: "manual",
        SORTEIO: "sorteio",
        ALEATORIO: "aleatorio",
      } as const;
    
      type ChaveDistribuicao = keyof typeof mapa;
    
      const chave = valor.toUpperCase() as ChaveDistribuicao;
      const resultado = mapa[chave];
    
      if (!resultado) {
        throw new Error("Valor inválido. Use: MANUAL, SORTEIO ou ALEATORIO.");
      }
    
      return resultado;
    }

    selectTab(tab: 'status' | 'leads' | 'advogado'): void {
      this.activeTab = tab;
    }

    attConfiguracoes(valor: string) {
      this.configuracoesService.updateConfiguracoes('DISTRIBUICAO_LEADS', valor).subscribe(
        (res) => {}, 
        (error) => {
          this.notificationService.showMessage('Não foi possivel atualizar a configuração de leads', 'error')
        }
      );
    }

    setLeadAssignmentType(type: LeadAssignmentType): void {
      this.attConfiguracoes(type);
      this.leadAssignmentType = type;
    }
}
