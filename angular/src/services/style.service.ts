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
    color_one: '#092db0',
    color_two: '#4B97F5',
    color_three: '#AED6F5',
    color_four: '#FFFFFF',
    color_five: '#0D0D2E',
    titleSize: 32,
    subtitleSize: 24,
    textSize: 16
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeStyles();
  }

  private initializeStyles(): void {
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
      this.setFontStyles(completeStyles); // Añadido para manejar fuentes
      if (saveToStorage) {
        try {
          localStorage.setItem('CurrentStyles', JSON.stringify(completeStyles));
        } catch (e) {
          console.error('Error saving styles to localStorage:', e);
        }
      }
    }
  }

  // Nuevo método específico para fuentes
  applyFontStyles(fontStyles: {titleSize?: number, subtitleSize?: number, textSize?: number}): void {
    const currentStyles = this.getCurrentStyles();
    const newStyles = {
      ...currentStyles,
      ...fontStyles
    };
    this.applyStyles(newStyles);
  }

  private setCssVariables(styles: any): void {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', styles.color_one);
    root.style.setProperty('--secondary-color', styles.color_two);
    root.style.setProperty('--tertiary-color', styles.color_three);
    root.style.setProperty('--ligth-color', styles.color_four);
    root.style.setProperty('--dark-color', styles.color_five);
  }

  // Nuevo método para establecer variables CSS de fuentes
  private setFontStyles(styles: any): void {
    const root = document.documentElement;
    root.style.setProperty('--title-font', `${styles.titleSize}px`);
    root.style.setProperty('--subtitle-font', `${styles.subtitleSize}px`);
    root.style.setProperty('--text-font', `${styles.textSize}px`);
  }

  resetToDefault(): void {
    this.applyStyles(this.defaultStyles);
  }

  getCurrentStyles(): any {
    return this.currentStyles.value || this.defaultStyles;
  }
}