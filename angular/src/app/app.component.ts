import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { StyleManagerService } from '../services/style.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
    <app-footer />
    
  `,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular';

  constructor(private styleManager: StyleManagerService) {}

  ngOnInit(): void {
    // Esto fuerza la aplicación de estilos al inicio
    this.styleManager.styles$.subscribe();
  }
}
