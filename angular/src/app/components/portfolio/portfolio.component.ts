import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {
activeFilter = 'all';

  portfolioItems = [
    { id: 1, category: 'app', title: 'App 1', img: 'img/portfolio/app1.jpg' },
    { id: 2, category: 'web', title: 'Web 3', img: 'img/portfolio/web3.jpg' },
    { id: 3, category: 'app', title: 'App 2', img: 'img/portfolio/app2.jpg' },
    { id: 4, category: 'card', title: 'Card 2', img: 'img/portfolio/card2.jpg' },
    { id: 5, category: 'web', title: 'Web 2', img: 'img/portfolio/web2.jpg' },
    { id: 6, category: 'app', title: 'App 3', img: 'img/portfolio/app3.jpg' },
    { id: 7, category: 'card', title: 'Card 1', img: 'img/portfolio/card1.jpg' },
    { id: 8, category: 'card', title: 'Card 3', img: 'img/portfolio/card3.jpg' },
    { id: 9, category: 'web', title: 'Web 1', img: 'img/portfolio/web1.jpg' }
  ];

  filters = ['all', 'app', 'card', 'web'];

  get filteredItems() {
    return this.activeFilter === 'all'
      ? this.portfolioItems
      : this.portfolioItems.filter(item => item.category === this.activeFilter);
  }

  setActiveFilter(filter: string) {
    this.activeFilter = filter;
  }

  // Función para capitalizar palabras
  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
