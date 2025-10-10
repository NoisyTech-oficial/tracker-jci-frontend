import { Component, OnInit } from '@angular/core';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { UserService } from 'src/app/services/user/user.service';
import { Header } from 'src/app/shared/interfaces/header.interface';
import { NumberProcessObtained } from 'src/app/shared/interfaces/processes-obtained-data.interface';
import { UserData } from 'src/app/shared/interfaces/user-data.interface';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent implements OnInit {
    header: Header = { title: 'Configurações', subtitle: 'Definições do seu sistema' };
    // userData: UserData = this.userService.getUserData();

    activeTab: 'status' | 'advogado' = 'status';

    constructor(private processosService: ProcessesService, private userService: UserService) {}

    ngOnInit(): void {

    }

    selectTab(tab: 'status' | 'advogado'): void {
      this.activeTab = tab;
    }
}
