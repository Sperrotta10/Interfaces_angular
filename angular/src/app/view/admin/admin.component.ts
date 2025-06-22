import { Component,ElementRef, ViewChild } from '@angular/core';
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




  @ViewChild('fontPreview') fontPreview!: ElementRef<HTMLDivElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  fontName: string = '';
  fontUrl: string | null = null;
  previewText: string = 'OMG, nuevo estilo bang bang bang!';
  customPreviewText: string = '';
  isFontLoaded: boolean = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file && (file.type === 'font/ttf' || file?.name.endsWith('.ttf'))) {
      this.fontName = file.name.replace('.ttf', '');
      this.createFontUrl(file);
    } else {
      alert('Por favor sube archivo valido (ttf)');
    }
  }

  private createFontUrl(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      this.fontUrl = URL.createObjectURL(file);
      this.loadFont();
    };
    
    reader.readAsArrayBuffer(file);
  }

  private loadFont(): void {
    if (!this.fontUrl || !this.fontName) return;

    const fontFace = new FontFace(this.fontName, `url(${this.fontUrl})`);
    
    fontFace.load().then((loadedFace) => {
      
      if ('fonts' in document) {
        
        (document.fonts as any).add(loadedFace);
      } else {
        // Si anterior el codigo no se funciona, se usara esta
        this.injectFontStyle(loadedFace);
      }
      
      this.isFontLoaded = true;
      this.updatePreview();
    }).catch(err => {
      console.error('Falla de carga ttf:', err);
      alert('Falla de carga ttf, por favor buscar otro archivo de ttf');
    });
  }

  private injectFontStyle(fontFace: FontFace): void {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${fontFace.family}';
        src: url(${this.fontUrl}) format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }

  updatePreview(): void {
    if (this.customPreviewText) {
      this.previewText = this.customPreviewText;
    }
    
    if (this.fontName && this.fontPreview) {
      this.fontPreview.nativeElement.style.fontFamily = this.fontName;
    }
  }

  applyFont(): void {
    if (!this.fontName) return;
    
    // Aqui es un ejemplo para ver como se aplica el cambio de estilos
    document.body.style.fontFamily = `'${this.fontName}', sans-serif`;
  }

  resetFont(): void {
    this.fontUrl = null;
    this.fontName = '';
    this.isFontLoaded = false;
    this.fileInput.nativeElement.value = '';
    if (this.fontPreview) {
      this.fontPreview.nativeElement.style.fontFamily = '';
    }
    document.body.style.fontFamily = '';
  }

  ngOnDestroy(): void {
    // Eliminar el estilo elegido
    if (this.fontUrl) {
      URL.revokeObjectURL(this.fontUrl);
    }
  }
}
