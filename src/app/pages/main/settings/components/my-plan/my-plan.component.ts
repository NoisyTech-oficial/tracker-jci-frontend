import { Component, OnInit } from '@angular/core';
import { ProcessesService } from 'src/app/services/processes/processes.service';
import { UserService } from 'src/app/services/user/user.service';
import { Header } from 'src/app/shared/interfaces/header.interface';
import { NumberProcessObtained } from 'src/app/shared/interfaces/processes-obtained-data.interface';

@Component({
  selector: 'app-my-plan',
  templateUrl: './my-plan.component.html',
  styleUrls: ['./my-plan.component.scss']
})
export class MyPlanComponent implements OnInit {
    header: Header = { title: 'Meu Plano', subtitle: 'Informações sobre seu plano e empresa' };
    userData = this.userService.getUserData();

    totalAvailable: number = 0;
    totalObtained: number = 0;

    constructor(private processosService: ProcessesService, private userService: UserService) {}

    ngOnInit(): void {
      this.processosService.getNumberProcessesObtained().subscribe((res: NumberProcessObtained) => {
        this.totalObtained = res.usedProcesses;
        this.totalAvailable = res.limitProcesses;
      });
  
      this.userData = this.userService.getUserData();
    }
  
    getPlanFormat(plan: string): string {
      switch (plan) {
        case 'BASIC':
          return 'TRACKER';
        case 'INTERMEDIARY':
          return 'PRIME';
        case 'PREMIUM':
          return 'EXCLUSIVE';
        default:
          return plan;
      }
    }
}
