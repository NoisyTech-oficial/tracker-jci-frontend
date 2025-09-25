import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent {

  hovering = false;
  showSupportButton = true;

  openSupport() {
    const message = 'Olá! Preciso de suporte com o JurisTracker.';
    const phone = environment.suportContact;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  closeSupport() {
    this.showSupportButton = false;
  }
}
