import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService1 } from '../../../services/proyect1/api.service';
import { ApiService2 } from '../../../services/proyect2/api.service';
import { stat } from 'fs';

@Component({
  selector: 'app-test-api',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-api.component.html',
  styleUrl: './test-api.component.css'
})
export class TestApiComponent implements OnInit {

  result: any;

  constructor(private apiService: ApiService1, private apiService2 : ApiService2) {}

  ngOnInit(): void {
    console.log('Componente TestApiComponent inicializado');
  }

  // testing de apis Proyect1

  async testGetStyles() { //✅
    this.result = await this.apiService.getStyles();
  }

  async testGetFontStyles() { //✅
    this.result = await this.apiService.getFontStyles();
  }

  async testCreateStyles() {
    const data = {
      moduleColor: {
        colors: {
          color_one : "#ffffff",
          color_two : "#555555",
          color_three : "#000000",
          color_four : "#dbdbdb",
          color_five : "#aaaaaa"
        },
        name : "Paleta 1"
      }
    };
    this.result = await this.apiService.createStyles(data);
  }

  async testCreateFontStyles() { //✅
    const data = {
      moduleFont: {
        title : 100,
        sub_title : 80,
        paragraph : 40,
        fontFamily : {
            name_principal : "Poppins",
            url_principal : "/blabla/blabla.ttf",
            name_secundary : "Lato",
            url_secundary : "/blabla/blabla2.ttf"
        }
      }
    };
    this.result = await this.apiService.createFontStyles(data);
  }

  async testDeleteColor() { //✅
    const id = prompt('Ingresa el ID del color a eliminar');
    if (id) {
      this.result = await this.apiService.deleteColors(id);
    }
  }

  async testDeleteFont() { //✅
    const id = prompt('Ingresa el ID de la fuente a eliminar');
    if (id) {
      this.result = await this.apiService.deleteFonts(id);
    }
  }

  async testUpdateColor() { //✅
    const id = prompt('ID del color a actualizar');
    const value = prompt('Nuevo valor (ej: #00FF00)');
    if (id && value) {
      const data = { color_one : value };
      this.result = await this.apiService.updateColor(id, data);
    }
  }

  async testUpdateFont() { //✅
    const id = prompt('ID de la fuente a actualizar');
    const size = prompt('Nuevo tamaño de titulo (ej: 16px)');
    if (id && size) {
      const data = { title: Number(size) };
      this.result = await this.apiService.updateFont(id, data);
    }
  }

  async testLogin() { //✅
    const credentials = {
      email: 'santiago777@gmail.com',
      password: 'S123456789@'
    };
    this.result = await this.apiService.login(credentials);
  }


  // Testing de apis Proyect2

  async testGetUsers() { //✅
    this.result = await this.apiService2.getUsers();  
  }

  async testCreateUser() { //✅
    const data = {
      user_name : "Santiago777",
      email : "santiago@gmail.com",
      password : "S123456789@" 
    };
    this.result = await this.apiService2.createUser(data);
  }

  async testUpdateUser() { //✅
    const id = prompt('ID del usuario a actualizar');
    const edad = prompt('ingrese su nuevo edad (ej: 25)');
    const status = prompt('ingrese su nuevo estado (ej: true o false)');
    if (id && edad && status) {
      const data = { age : Number(edad), status : status === 'true' };
      this.result = await this.apiService2.updateUser(id, data);
    }
  }
}
