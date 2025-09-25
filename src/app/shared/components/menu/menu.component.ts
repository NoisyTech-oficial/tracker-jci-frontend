import { UserService } from './../../../services/user/user.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ProfileUserEnum } from 'src/app/shared/enums/profile-user.enum';
import { UserData } from 'src/app/shared/interfaces/user-data.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  constructor(private authService: AuthService, private userService: UserService) { }

  isCollapsed = true;
  isSubmenuOpen = false;
  userData!: UserData;

  menuItems = [
    // { label: 'Dashboard', icon: 'dashboard', link: '/dashboard', permission: 'DASHBOARD' },
    { label: 'Meus Processos', icon: 'insights', link: '/meus-processos', permission: 'MEUS_PROCESSOS' },
    { label: 'Obter Processos', icon: 'find_in_page', link: '/obter-processos', permission: 'OBTER_PROCESSOS' },
    { label: 'Funcionários', icon: 'groups', link: '/funcionarios', permission: 'FUNCIONARIOS' },
  ];
  
  ngOnInit(): void {
    this.userData = this.userService.getUserData();
    this.filterMenu();
  }

  filterMenu() {
    if (this.userData.viewing_permission && this.userData.profile !== ProfileUserEnum.ADMINISTRADOR) {
      this.menuItems = this.menuItems.filter(item => this.userData.viewing_permission.includes(item.permission));
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.isSubmenuOpen = false;
    }  
  }

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  toggleSubMenuAndSidebar() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
    if (!this.isCollapsed) {
      this.toggleSidebar();
    }
  }

  logout() {
    this.authService.clearToken();
  }
}
