import { UserService } from 'src/app/services/user/user.service';
import { UserData } from './../../shared/interfaces/user-data.interface';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  isLoading: boolean = false;
  isFirstAccess: boolean = false;
  userDisabled: boolean = false;

  ngOnInit(): void {
    this.showSpinner();
    this.userService.getUser().subscribe((userData: UserData) => {
      this.userService.setUser(userData);
      this.verifyRules(userData.first_access, userData.user_activated);
      this.hideSpinner();
    });
  }

  verifyRules(firstAccess: boolean, userActivated: boolean) {
    if (!userActivated) {
      this.userDisabled = true;
      return;
    }

    this.isFirstAccess = firstAccess;
    if(!firstAccess) {
      const currentRoute = this.router.url;
      if (currentRoute === '/') {
        this.router.navigate(['/inicio']); 
      }
    }
  }

  showSpinner(): void {
    this.isLoading = true;
    this.spinner.show();
  }

  hideSpinner() {
    this.isLoading = false;
    this.spinner.hide();
  }
}
