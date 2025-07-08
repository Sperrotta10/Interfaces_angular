import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService1 {
  private baseURL = 'http://localhost:3000/api/v1';

  constructor(private http: HttpClient) {}

  async getStyles() {
    try {

        const colors = await firstValueFrom(this.http.get<any>(`${this.baseURL}/color/`, { withCredentials: true }));
        const fonts = await firstValueFrom(this.http.get<any>(`${this.baseURL}/font/`, { withCredentials: true }));

        console.log(colors.message);
        return {
            colors: colors.data,
            fonts: fonts.data
        };
    } catch (error) {
        console.error('Error al obtener la configuración por defecto:', error);
    }
    return false;
  }

  async getFontStyles() {
    try {

        const fonts = await firstValueFrom(this.http.get<any>(`${this.baseURL}/font/`, { withCredentials: true }));
        console.log(fonts.message);
        return { fonts: fonts.data };
    } catch (error) {
        console.error('Error al obtener fuentes:', error);
    }
    return false;
  }

  async createStyles(data: any) {
    try {

        const color = data.moduleColor;
        const res = await firstValueFrom(this.http.post<any>(`${this.baseURL}/color/`, color, { withCredentials: true }));
        if (res) {
            console.log("Estilos creados:", res);
            return true;
        }
    } catch (error) {
        console.error("Error al crear los estilos:", error);
    }
    return false;
  }

  async createFontStyles(data: any) {
    try {

        const font = data;
        const res = await firstValueFrom(this.http.post<any>(`${this.baseURL}/font/`, font, { withCredentials: true }));
        if (res) {
            console.log("Fuentes creadas:", res);
            return true;
        }
    } catch (error) {
        console.error("Error al crear fuentes:", error);
    }
    return false;
  }

  async deleteColors(id: string) {
    try {

        await firstValueFrom(this.http.delete(`${this.baseURL}/color/${id}`, { withCredentials: true }));
    } catch (error) {
        console.error("Error al eliminar color:", error);
    }
    return false;
  }

  async deleteFonts(id: string) {
    try {

        await firstValueFrom(this.http.delete(`${this.baseURL}/font/${id}`, { withCredentials: true }));
    } catch (error) {
        console.error("Error al eliminar fuente:", error);
    }
    return false;
  }

  async updateColor(id: string, data: any) {
    try {

        await firstValueFrom(this.http.patch(`${this.baseURL}/color/${id}`, data, { withCredentials: true }));
    } catch (error) {
        console.error("Error al actualizar color:", error);
    }
    return false;
  }

  async updateFont(id: string, data: any) {
    try {

        await firstValueFrom(this.http.patch(`${this.baseURL}/font/${id}`, data, { withCredentials: true }));
    } catch (error) {
      console.error("Error al actualizar fuente:", error);
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
}
