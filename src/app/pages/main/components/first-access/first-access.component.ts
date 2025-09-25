import { UserService } from 'src/app/services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserData } from 'src/app/shared/interfaces/user-data.interface';
import { PutUserData } from 'src/app/shared/interfaces/put-user-data.interface';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-first-access',
  templateUrl: './first-access.component.html',
  styleUrls: ['./first-access.component.scss']
})
export class FirstAccessComponent implements OnInit {
  userData!: UserData;
  firstAccessForm!: FormGroup;
  hidePassword: boolean = true;
  isloading: boolean = false;
  termsAccepted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.userData = this.userService.getUserData();
  }

  buildForm() {
    this.firstAccessForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.minLength(5),
        Validators.pattern(/^[A-Za-zÀ-ú\s]+$/)
      ]
    ],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  confirmFirstAccess() {
    this.isloading = true;
    if (this.firstAccessForm.invalid) {
      this.notificationService.showMessage('Preencha os campos corretamente!', 'error');
      return;
    }

    this.userService.putUser(this.getUser()).subscribe({
      next: () => {
        this.notificationService.showMessage('Primeiro acesso realizado com sucesso', 'success');
        setTimeout(() => {
          this.isloading = false;
          window.location.reload();
        }, 1500);
      },
      error: () => {
        this.isloading = false;
        this.notificationService.showMessage('Algo deu errado, tente novamente.', 'error');
      }
    });
  }

  getUser(): PutUserData {
    return {
      name: this.firstAccessForm.get('name')!.value,
      agree_terms: true,
      first_access: false,
      new_password: this.firstAccessForm.get('password')!.value
    };
  }

  allowOnlyLetters(event: KeyboardEvent) {
    const inputChar = event.key;
  
    // Regex para permitir apenas letras (inclusive acentos) e espaço
    const validChars = /^[A-Za-zÀ-ÿ\s]+$/;
  
    if (!validChars.test(inputChar)) {
      event.preventDefault(); // impede que caracteres inválidos sejam inseridos
    }
  }
  
}
