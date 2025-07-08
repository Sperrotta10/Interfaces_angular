import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService2 } from '../../../services/proyect2/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-personal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-personal.component.html',
  styleUrl: './perfil-personal.component.css'
})
export class PerfilPersonalComponent implements OnInit {
  firstName: string = '';
  phone: string = '';
  email: string = '';
  image: string = '';

  constructor(private apiService: ApiService2, private router: Router) { }
  goToEdit() {
    this.router.navigate(['/user-form']);
  }

  ngOnInit(): void {
    const UserID = this.getUserID();
    this.getUserbyID(UserID).then(data => {
      if (data && data.data) {
        this.firstName = data.data.firstName || '';
        this.phone = data.data.phone || '';
        this.email = data.data.email || '';
        this.image = data.data.image || '';
      }
    });
  }

  async getUserbyID(user_id:string) { //✅
    try {
      const result = await this.apiService.getUserById(user_id);
      return result;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  getUserID() { //✅
    try{
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.user_id || null; // Retorna el userId si existe, o null si no
      }
    }catch (error) {
      console.log('Error fetching user ID:', error);
      return null;
    }
  }


}
