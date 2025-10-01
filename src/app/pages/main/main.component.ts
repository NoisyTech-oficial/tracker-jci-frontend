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
    private servicoUsuario: UserService,
    private carregador: NgxSpinnerService,
    private roteador: Router
  ) { }

  estaCarregando: boolean = false;
  primeiroAcesso: boolean = false;
  perfilAdmin: boolean = false;
  temAdvogado: boolean = false;
  usuarioDesativado: boolean = false;

  ngOnInit(): void {
    this.mostrarCarregador();
    this.servicoUsuario.getUser().subscribe((dadosUsuario: UserData) => {
      this.servicoUsuario.setUser(dadosUsuario);

      const temAdvogado = dadosUsuario.id_advogado ? true : false;
      this.verificarRegras(dadosUsuario.primeiro_acesso, dadosUsuario.usuario_ativo, dadosUsuario.perfil, temAdvogado);
      
      this.ocultarCarregador();
    });
  }

  verificarRegras(primeiroAcesso: boolean, usuarioAtivado: boolean, perfil: string, temAdvogado: boolean) {
    if (!usuarioAtivado) {
      this.usuarioDesativado = true;
      return;
    }

    this.primeiroAcesso = primeiroAcesso;
    if(!primeiroAcesso) {
      const rotaAtual = this.roteador.url;
      if (rotaAtual === '/') {
        this.roteador.navigate(['/inicio']); 
      }
    }
  }

  mostrarCarregador(): void {
    this.estaCarregando = true;
    this.carregador.show();
  }

  ocultarCarregador() {
    this.estaCarregando = false;
    this.carregador.hide();
  }
}
