import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService2 } from './proyect2/api.service';
import { BehaviorSubject, Observable } from 'rxjs'; // BehaviorSubject para el estado observable
import { Platform } from '@angular/cdk/platform';

// Define la estructura de un usuario logeado
export interface User {
  email: string;
  userId: string;
  user_name?: string;
  role: 'admin' | 'user'; // Roles específicos de tu aplicación
  // Añade otras propiedades que guardes en localStorage
}

@Injectable({
  providedIn: 'root' // Este servicio será un singleton disponible en toda la aplicación
})
export class AuthService {

  // BehaviorSubject para mantener el estado del usuario.
  // null si no hay usuario logeado, User si lo hay.
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId : Object, private apiService: ApiService2) {
    // Intenta cargar el usuario desde localStorage al iniciar el servicio
    let initialUser: User | null = null;

    if (isPlatformBrowser(this.platformId)) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                initialUser = JSON.parse(storedUser);
            } catch (e) {
                console.error('Error parsing user from localStorage:', e);
                // Si hay un error al parsear, no asignamos el usuario
                localStorage.removeItem('user'); // Limpia el localStorage si hay un error
            }
        }
        // Puedes añadir un listener al evento global que disparas desde el login
        window.addEventListener('userLoggedIn', () => {
            this.loadCurrentUserFromLocalStorage();
        });
    }
    
    this.currentUserSubject = new BehaviorSubject<User | null>(initialUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Carga el usuario desde localStorage y actualiza el BehaviorSubject
  private loadCurrentUserFromLocalStorage(): void {

    if (isPlatformBrowser(this.platformId)) { // Solo en navegador
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          this.currentUserSubject.next(JSON.parse(storedUser));
        } catch (e) {
          console.error("Error parsing user from localStorage during refresh", e);
          localStorage.removeItem('user');
          this.currentUserSubject.next(null);
        }
      } else {
        this.currentUserSubject.next(null);
      }
    } else {
      this.currentUserSubject.next(null); // Asegurar que es null en SSR
    }

  }

  // Método para obtener el usuario actual (sincrónico)
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {

    // Si no estamos en el navegador, por defecto no se considera autenticado para SSR
    if (!isPlatformBrowser(this.platformId)) {
        return false;
    }
    return this.currentUserSubject.value !== null;

  }

  // Verifica si el usuario tiene un rol específico
  hasRole(requiredRole: 'admin' | 'user'): boolean {
    // Si no estamos en el navegador, no hay rol definido
    if (!isPlatformBrowser(this.platformId)) {
        return false;
    }
    const user = this.currentUserSubject.value;
    return user?.role === requiredRole;
  }

  // Cierre de sesión
   async logout(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
        const islogout = await this.apiService.logout(); // Llama al método de logout de tu ApiService2
        if (!islogout) {
            console.error('No se pudo cerrar sesión correctamente.');
            return;
        }
        localStorage.removeItem('user');
        this.currentUserSubject.next(null); // Emite que no hay usuario logeado
        this.router.navigate(['/login']); // Redirige a la página de login
    } else {
        this.currentUserSubject.next(null); // Asegura que el usuario es null en SSR
    }
  }
}
