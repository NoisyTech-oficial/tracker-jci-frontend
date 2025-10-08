import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import imageCompression from 'browser-image-compression';
import { UserService } from 'src/app/services/user/user.service';
import { Header } from 'src/app/shared/interfaces/header.interface';
import { DadosPerfilUsuario } from 'src/app/shared/interfaces/user-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {
  @ViewChild('inputImagem') inputImagem!: ElementRef<HTMLInputElement>;

  header: Header = {
    title: 'Meu Perfil',
    subtitle: 'Acesse suas informações e altere se necessário'
  };

  profileForm!: FormGroup;
  userData!: DadosPerfilUsuario;

  userPhoto: string = 'https://www.gravatar.com/avatar/?d=mp&s=200';
  imagemArquivo: File | null = null;
  imagemBase64: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private mask: MasksService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarDadosUsuario();
  }

  private inicializarFormulario(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  private carregarDadosUsuario(): void {
    const user = this.userService.getUserData();

    if (user) {
      this.userData = {
        nome: user.nome,
        email: user.email,
        documento: this.mask.formatDocument(user.documento) || '-',
        foto: user.foto
      };

      this.profileForm.patchValue({
        name: this.userData.nome,
        email: this.userData.email
      });

      if (user.foto) this.userPhoto = user.foto;
    }
  }

  selecionarImagem(): void {
    this.inputImagem.nativeElement.click();
  }

  /** Comprime e exibe preview */
  async converterParaBase64(event: Event): Promise<void> {
    const arquivoOriginal = (event.target as HTMLInputElement).files?.[0];
    if (!arquivoOriginal) return;

    try {
      // 🔽 Configuração de compressão
      const opcoes = {
        maxSizeMB: 0.3,          // tamanho máximo em MB (~300 KB)
        maxWidthOrHeight: 800,   // redimensiona se muito grande
        useWebWorker: true
      };

      // 🧩 Comprime o arquivo
      const arquivoComprimido = await imageCompression(arquivoOriginal, opcoes);
      this.imagemArquivo = arquivoComprimido;

      // 🔍 Mostra preview
      const leitor = new FileReader();
      leitor.onload = () => {
        this.imagemBase64 = leitor.result as string;
        this.userPhoto = this.imagemBase64; // exibe preview
      };
      leitor.readAsDataURL(arquivoComprimido);

      console.log(
        `Imagem original: ${(arquivoOriginal.size / 1024).toFixed(1)} KB`,
        `→ Comprimida: ${(arquivoComprimido.size / 1024).toFixed(1)} KB`
      );

    } catch (erro) {
      console.error('Erro ao comprimir a imagem:', erro);
    }
  }

  salvar(): void {
    if (this.profileForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.profileForm.value.name);
    formData.append('email', this.profileForm.value.email);

    if (this.imagemArquivo) {
      formData.append('foto', this.imagemArquivo);
    }

    this.userService.putUsuario(formData).subscribe({
      next: (res) => console.log('Perfil atualizado com sucesso:', res),
      error: (err) => console.error('Erro ao atualizar perfil:', err)
    });
  }
}