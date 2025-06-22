import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms'

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
//Valores de colores defectos
  headerBgColor = '#3498db';
  titleColor = '#ffffff';
  divBorderColor = '#95a5a6';
  footerBgColor = '#2c3e50';
  cardBgColor = '#ecf0f1';

  titleFontSize = 36;
  

  //cambia modo de vista
  vista_modo: 'colores' | 'letras' = 'colores';
}
