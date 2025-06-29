import { Component, HostListener, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements AfterViewInit{
  mobileNavActive = false;
  isAuthenticated$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  currentUser$: Observable<User | null>;

  constructor(private renderer: Renderer2, private el: ElementRef, private authService: AuthService) {
    this.isAuthenticated$ = this.authService.currentUser.pipe(
      map(user => !!user) // Emite true si hay usuario, false si es null
    );
    this.isAdmin$ = this.authService.currentUser.pipe(
      map(user => user?.role === 'admin') // Emite true si el rol es 'admin'
    );
    this.currentUser$ = this.authService.currentUser;
  }

  async logout(): Promise<void> {
    this.authService.logout();
  }

  ngAfterViewInit(): void {
    this.setupDropdowns();
    this.checkInitialState();
  }

  toggleMobileNav(): void {
    this.mobileNavActive = !this.mobileNavActive;
    this.updateBodyClass();
    this.updateToggleIcon();
  }

  private updateBodyClass(): void {
    if (this.mobileNavActive) {
      this.renderer.addClass(document.body, 'mobile-nav-active');
    } else {
      this.renderer.removeClass(document.body, 'mobile-nav-active');
    }
  }

  private updateToggleIcon(): void {
    const icon = this.el.nativeElement.querySelector('.mobile-nav-toggle i');
    if (icon) {
      this.renderer.removeClass(icon, this.mobileNavActive ? 'fa-bars' : 'fa-times');
      this.renderer.addClass(icon, this.mobileNavActive ? 'fa-times' : 'fa-bars');
    }
  }

  private setupDropdowns(): void {
    const dropdownToggles = this.el.nativeElement.querySelectorAll('.mobile-nav .drop-down > a');
    dropdownToggles.forEach((toggle: HTMLElement) => {
      this.renderer.listen(toggle, 'click', (e) => {
        e.preventDefault();
        const parent = toggle.parentElement;
        if (parent) {
          const dropdown = toggle.nextElementSibling as HTMLElement;
          if (dropdown) {
            const isVisible = dropdown.style.display === 'block';
            this.renderer.setStyle(dropdown, 'display', isVisible ? 'none' : 'block');
            this.renderer[isVisible ? 'removeClass' : 'addClass'](parent, 'active');
          }
        }
      });
    });
  }

  private checkInitialState(): void {
    // Asegurarse que el menú móvil esté oculto al inicio
    const mobileNav = this.el.nativeElement.querySelector('.mobile-nav');
    if (mobileNav) {
      this.renderer.setStyle(mobileNav, 'right', '-300px');
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const mobileNav = this.el.nativeElement.querySelector('.mobile-nav');
    const mobileNavToggle = this.el.nativeElement.querySelector('.mobile-nav-toggle');
    const overlay = this.el.nativeElement.querySelector('.mobile-nav-overly');

    // Cerrar menú si se hace clic fuera
    if (this.mobileNavActive && 
        !mobileNav?.contains(target) && 
        !mobileNavToggle?.contains(target)) {
      this.closeMenu();
    }
  }

  private closeMenu(): void {
    this.mobileNavActive = false;
    this.updateBodyClass();
    this.updateToggleIcon();
  }

}
