// style-manager.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StyleManagerService {
  private currentStyles = new BehaviorSubject<any>(null);
  styles$ = this.currentStyles.asObservable();

  updateStyles(styles: any): void {
    this.currentStyles.next(styles);
    localStorage.setItem('CurrentStyles', JSON.stringify(styles));
    
    // Aplica a las variables CSS
    document.documentElement.style.setProperty('--primary-color', styles.color_one);
    document.documentElement.style.setProperty('--secondary-color', styles.color_two);
    document.documentElement.style.setProperty('--tertiary-color', styles.color_three);
    document.documentElement.style.setProperty('--ligth-color', styles.color_four);
    document.documentElement.style.setProperty('--dark-color', styles.color_five);
    // ... otras propiedades
  }
}