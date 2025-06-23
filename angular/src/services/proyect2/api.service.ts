import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService2 {
  private baseURL = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  async getUsers() {
    try {

        const islogin = await this.login({
            email: 'santiago@gmail.com',
            password: 'S123456789@'
        });

        if (!islogin || !islogin.status) {
            console.error('No se pudo iniciar sesión. Verifique sus credenciales.');
            return null;
        }

        const user = await firstValueFrom(this.http.get<any>(`${this.baseURL}/auth/`, { withCredentials: true }));

        console.log(user.message);
        return user.data;

    } catch (error) {
        console.error('Error al obtener la configuración por defecto:', error);
    }
    return false;
  }

  async createUser(data: any) {
    try {

        const res = await firstValueFrom(this.http.post<any>(`${this.baseURL}/auth/register`, data, { withCredentials: true }));
        if (res) {
            console.log("Usuario creado:", res);
            return true;
        }
    } catch (error) {
        console.error("Error al crear usuario:", error);
    }
    return false;
  }


  async updateUser(id: string, data: any) {
    try {

        const islogin = await this.login({
            email: 'santiago@gmail.com',
            password: 'S123456789@'
        });

        if (!islogin || !islogin.status) {
            console.error('No se pudo iniciar sesión. Verifique sus credenciales.');
            return null;
        }

        await firstValueFrom(this.http.patch(`${this.baseURL}/auth/${id}`, data, { withCredentials: true }));
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
    }
    return false;
  }


  async login(data: { email: string; password: string }) {
    try {
        const res = await firstValueFrom(this.http.post<any>(`${this.baseURL}/auth/login`, data, { withCredentials: true }));
        if (res) {
            console.log(res.message);
            return { status: true, data: res.data };
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    }
    return false;
  }

  async logout() {
    try {
        const res = await firstValueFrom(this.http.post<any>(`${this.baseURL}/auth/logout`, { withCredentials: true }));

        if (res) {
            console.log(res.message);
            return { status: true, data: res.data };
        }
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
    return false;
  }
}
