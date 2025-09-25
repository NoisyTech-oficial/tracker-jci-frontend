import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-user-disabled',
  templateUrl: './user-disabled.component.html',
  styleUrls: ['./user-disabled.component.scss']
})
export class UserDisabledComponent {
  constructor(private authService: AuthService) {}
  
  logout() {
    this.authService.clearToken();
  }
}
