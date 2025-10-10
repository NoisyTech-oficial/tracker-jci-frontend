import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import IMask from 'imask';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { DocumentValidator } from 'src/app/shared/validators/document-length';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('documentInput') documentoInput!: ElementRef;

  hidePassword: boolean = true;
  loginForm!: FormGroup;
  isloading: boolean = false;
  loginError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.startForm();
  }

  ngAfterViewInit() {
    const documentoField = this.documentoInput.nativeElement;

    IMask(documentoField, {
      mask: [
        { mask: '000.000.000-00', maxLength: 11 },
        { mask: '00.000.000/0000-00', maxLength: 14 }
      ]
    });

    // Foco automático no primeiro campo
    documentoField.focus();
  }

  startForm() {
    this.loginForm = this.fb.group({
      documento: ['', [Validators.required, DocumentValidator.validateDocumentLength]],
      senha: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.notificationService.showMessage('Preencha os campos corretamente!', 'error');
      return;
    }

    this.isloading = true;
    this.loginError = false;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: () => {
        this.notificationService.showMessage('Algo deu errado, tente novamente.', 'error');
        this.loginForm.controls['senha'].setValue('');
        this.isloading = false;
        this.loginError = true;
        // Alterna rapidamente para permitir repetição da animação de vibração
        setTimeout(() => { this.loginError = false; }, 350);
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

}
