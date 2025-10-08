import { UserService } from 'src/app/services/user/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      nome: [null, []],
      email_advogado: [null, []],
      senha_advogado: [null, []],    
      totip_advogado: [null, []]
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

    this.userService.PutUsuarioPrimeiroLogin(this.getUser()).subscribe({
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
    const { nome, email_advogado, senha_advogado, totip_advogado } = this.firstAccessForm.value;
    const novoNovo = nome === null ? this.userData.nome : nome;

    const advogado = email_advogado && senha_advogado && totip_advogado 
      ? { email: email_advogado, senha: senha_advogado, totip: totip_advogado }
      : null;

    return { 
      nome: novoNovo, 
      advogado,
      primeiro_acesso: false,
      aceitou_termos: true
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
