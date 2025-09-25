import { Component, Input } from '@angular/core';
import { Header } from '../../interfaces/header.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() info!: Header;

}
