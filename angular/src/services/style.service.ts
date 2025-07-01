import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { url } from 'node:inspector';

@Injectable({
  providedIn: 'root'
})
export class StyleManagerService {
  private currentStyles = new BehaviorSubject<any>(null);
  private currentFonts = new BehaviorSubject<any>({
    name_principal: 'Arial',
    url_principal: '',
    name_secondary: 'Times New Roman',
    url_secondary: ''
  });
  font$ = this.currentFonts.asObservable();
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

  private defaultFonts = {
    name_principal: 'Arial',
    url_principal: '',
    name_secundary: 'Times New Roman',
    url_secundary: ''
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

  applyCustomFonts(fontData: {
    name_principal: string,
    url_principal: string,
    name_secundary: string,
    url_secundary: string
  }): void {
    if (isPlatformBrowser(this.platformId)) {

      // Eliminar estilos previos
      const existingStyle = document.getElementById('global-font-styles');
      if (existingStyle) existingStyle.remove();

      // Crear estilos para ambas fuentes
      const style = document.createElement('style');
      style.innerHTML = `
        @font-face {
          font-family: '${fontData.name_principal}';
          src: url('${this.formatFontUrl(fontData.url_principal)}') format('truetype');
        }
        @font-face {
          font-family: '${fontData.name_secundary}';
          src: url('${this.formatFontUrl(fontData.url_secundary)}') format('truetype');
        }
      `;
      document.head.appendChild(style);
      
      this.currentFonts.next(fontData);
      this.setFontFamilyVariables(fontData);
      
      // Guardar en localStorage
      localStorage.setItem('CustomFonts', JSON.stringify(fontData));
    }
  }

  private formatFontUrl(base64String: string): string {
    // Verificar si ya tiene el prefijo data:
    if (base64String.startsWith('data:')) {
      return base64String;
    }
    // Formatear como URL de datos si es necesario
    return `data:font/truetype;charset=utf-8;base64,${base64String}`;
  }

  private setFontFamilyVariables(fonts: any): void {
    const root = document.documentElement;

    if (fonts.name_principal) {
      root.style.setProperty('--font-principal', `'${fonts.name_principal}'`);
    }
  
    if (fonts.name_secundary) {
      root.style.setProperty('--font-secundaria', `'${fonts.name_secundary}'`);
    }
  }

  loadSavedFonts(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedFonts = localStorage.getItem('CustomFonts');
      if (savedFonts) {
        this.currentFonts.next(JSON.parse(savedFonts));
        this.applyCustomFonts(JSON.parse(savedFonts));
      }
    }
  }

  private ensureFontStyles(): void {
    const savedFonts = localStorage.getItem('CustomFonts');
    if (savedFonts) {
      const fonts = JSON.parse(savedFonts);
      this.setFontFamilyVariables(fonts);
      
      // Recrear los @font-face dinámicamente
      const style = document.createElement('style');
      style.id = 'global-font-styles';
      style.innerHTML = `
        @font-face {
          font-family: '${fonts.name_principal}';
          src: url('${this.formatFontUrl(fonts.url_principal)}') format('truetype');
        }
        @font-face {
          font-family: '${fonts.name_secundary}';
          src: url('${this.formatFontUrl(fonts.url_secundary)}') format('truetype');
        }
      `;
      document.head.appendChild(style);
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
      this.ensureFontStyles(); // Asegura que las fuentes se apliquen correctamente
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
    // Restablecer fuentes
    this.resetFonts();
  }

  resetFonts(): void {
    // Eliminar estilos de fuentes personalizadas
    const fontStyle = document.getElementById('global-font-styles');
    if (fontStyle) {
      document.head.removeChild(fontStyle);
    }

    // Restablecer variables CSS
    const root = document.documentElement;
    root.style.setProperty('--font-principal', this.defaultFonts.name_principal);
    root.style.setProperty('--font-secundaria', this.defaultFonts.name_secundary);

    // Limpiar localStorage
    localStorage.removeItem('CustomFonts');
    this.currentFonts.next(this.defaultFonts);
  }

  getCurrentStyles(): any {
    return this.currentStyles.value || this.defaultStyles;
  }
}