import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import imageCompression from 'browser-image-compression';
import { MatDialog } from '@angular/material/dialog';
import { finalize, switchMap } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import { Header } from 'src/app/shared/interfaces/header.interface';
import { DadosPerfilUsuario } from 'src/app/shared/interfaces/user-data.interface';
import { MasksService } from 'src/app/shared/masks/masks.service';
import { ConfirmAvatarDialogComponent } from './confirm-avatar-dialog/confirm-avatar-dialog.component';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
  @ViewChild('inputImagem') inputImagem!: ElementRef<HTMLInputElement>;

  header: Header = {
    title: 'Meu Perfil',
    subtitle: 'Acesse suas informações e altere se necessário'
  };

  profileForm!: FormGroup;
  userData!: DadosPerfilUsuario;

  private readonly defaultAvatarUrl = 'https://www.gravatar.com/avatar/?d=mp&s=200';
  userPhoto: string = this.defaultAvatarUrl;
  private confirmedPhotoUrl: string = this.defaultAvatarUrl;
  imagemArquivo: File | null = null;
  imagemBase64: string | null = null;
  isUploading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private mask: MasksService,
    private dialog: MatDialog,
    private notificationService: NotificationService
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
      const fotoBackend = user.image ?? user.foto ?? null;

      this.userData = {
        nome: user.nome,
        email: user.email,
        documento: this.mask.formatDocument(user.documento) || '-',
        foto: fotoBackend
      };

      this.profileForm.patchValue({
        name: this.userData.nome,
        email: this.userData.email
      });

      const foto = this.resolveAvatarUrl(fotoBackend);
      this.userPhoto = foto;
      this.confirmedPhotoUrl = foto;
    } else {
      this.userPhoto = this.defaultAvatarUrl;
      this.confirmedPhotoUrl = this.defaultAvatarUrl;
    }
  }

  selecionarImagem(): void {
    this.inputImagem.nativeElement.click();
  }

  /** Comprime e prepara preview */
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
        this.abrirDialogoConfirmacaoImagem();
      };
      leitor.readAsDataURL(arquivoComprimido);

    } catch (erro) {
      console.error('Erro ao comprimir a imagem:', erro);
      this.resetImageSelection();
    }
  }

  salvar(): void {
    if (this.profileForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.profileForm.value.name);
    formData.append('email', this.profileForm.value.email);

    this.userService.putUsuario(formData).subscribe({
      next: (res) => console.log('Perfil atualizado com sucesso:', res),
      error: (err) => console.error('Erro ao atualizar perfil:', err)
    });
  }

  private abrirDialogoConfirmacaoImagem(): void {
    if (!this.imagemBase64 || !this.imagemArquivo) {
      this.resetImageSelection();
      return;
    }

    const dialogRef = this.dialog.open(ConfirmAvatarDialogComponent, {
      width: '420px',
      data: { preview: this.imagemBase64 }
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        this.confirmarEnvioAvatar();
      } else {
        this.resetImageSelection();
      }
    });
  }

  private confirmarEnvioAvatar(): void {
    if (!this.imagemArquivo) return;

    if (this.imagemBase64) {
      this.userPhoto = this.imagemBase64;
    }

    this.enviarAvatar();
  }

  private enviarAvatar(): void {
    if (!this.imagemArquivo) return;

    this.isUploading = true;

    this.userService.uploadAvatar(this.imagemArquivo).pipe(
      switchMap(() => this.userService.getUser()),
      finalize(() => {
        this.isUploading = false;
        this.imagemArquivo = null;
        this.imagemBase64 = null;
        this.limparInputImagem();
      })
    ).subscribe({
      next: (user) => {
        this.userService.setUser(user);
        const foto = this.resolveAvatarUrl(user.image ?? user.foto ?? null);
        this.userPhoto = foto;
        this.confirmedPhotoUrl = foto;
        this.notificationService.showMessage('Foto do perfil atualizada!', 'success');
      },
      error: (error) => {
        this.notificationService.showMessage('Não foi possível atualizar a foto.', 'error');
        console.error('Erro ao atualizar avatar:', error);
        this.userPhoto = this.confirmedPhotoUrl;
      }
    });
  }

  private resetImageSelection(): void {
    this.imagemArquivo = null;
    this.imagemBase64 = null;
    this.userPhoto = this.confirmedPhotoUrl;
    this.limparInputImagem();
  }

  private limparInputImagem(): void {
    if (this.inputImagem?.nativeElement) {
      this.inputImagem.nativeElement.value = '';
    }
  }

  private resolveAvatarUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return this.defaultAvatarUrl;
    }

    if (typeof imagePath === 'string') {
      const trimmed = imagePath.trim();
      if (!trimmed) {
        return this.defaultAvatarUrl;
      }

      if (/^(data:|https?:\/\/)/i.test(trimmed)) {
        return trimmed;
      }

      try {
        return new URL(trimmed, environment.apiUrl).toString();
      } catch {
        return this.defaultAvatarUrl;
      }
    }

    return this.defaultAvatarUrl;
  }
}
