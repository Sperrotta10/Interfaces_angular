import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StyleManagerService {
  private currentStyles = new BehaviorSubject<any>(null);
  styles$ = this.currentStyles.asObservable();
  
  private defaultStyles = {
    color_one: '#3498db',
    color_two: '#ffffff',
    color_three: '#95a5a6',
    color_four: '#ecf0f1',
    color_five: '#2c3e50',
    titleSize: 32,
    subtitleSize: 24,
    textSize: 16
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeStyles();
  }

  private initializeStyles(): void {
    // Solo en el navegador
    if (isPlatformBrowser(this.platformId)) {
      try {
        const savedStyles = localStorage.getItem('CurrentStyles');
        const stylesToApply = savedStyles ? JSON.parse(savedStyles) : this.defaultStyles;
        this.applyStyles(stylesToApply, false);
      } catch (e) {
        console.error('Error loading styles from localStorage:', e);
        this.applyStyles(this.defaultStyles, false);
      }
    } else {
      // En SSR, usa los estilos por defecto
      this.currentStyles.next(this.defaultStyles);
    }
  }

  applyStyles(styles: any, saveToStorage: boolean = true): void {
    const completeStyles = {
      ...this.defaultStyles,
      ...styles
    };

    this.currentStyles.next(completeStyles);

    if (isPlatformBrowser(this.platformId)) {
      this.setCssVariables(completeStyles);
      if (saveToStorage) {
        try {
          localStorage.setItem('CurrentStyles', JSON.stringify(completeStyles));
        } catch (e) {
          console.error('Error saving styles to localStorage:', e);
        }
      }
    }
  }

  private setCssVariables(styles: any): void {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', styles.color_one);
    root.style.setProperty('--secondary-color', styles.color_two);
    root.style.setProperty('--tertiary-color', styles.color_three);
    root.style.setProperty('--ligth-color', styles.color_four);
    root.style.setProperty('--dark-color', styles.color_five);
  }

  resetToDefault(): void {
    this.applyStyles(this.defaultStyles);
  }

  getCurrentStyles(): any {
    return this.currentStyles.value || this.defaultStyles;
  }
}