import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Header } from 'src/app/shared/interfaces/header.interface';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent {

  header: Header = { title: 'Meu Perfil', subtitle: 'Acesse suas informações e altere se necessário' };

  userData = {
    name: 'Fulano da Silva',
    email: 'fulano@email.com',
    documento: '123.456.789-00'
  };

  userPhoto: string | null = 'https://www.gravatar.com/avatar/?d=mp&s=200';

  profileForm = this.fb.group({
    name: [this.userData.name, Validators.required],
    email: [this.userData.email, [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder) {}

  onChangePhoto() {
    // documento.querySelector < HTMLInputElement > ('#fileInput') ? .click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.userPhoto = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const updatedData = this.profileForm.value;
      console.log('Salvando dados do perfil:', updatedData);
      // Enviar para API...
    }
  }
}
