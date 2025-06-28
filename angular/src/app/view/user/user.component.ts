import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { MapComponent } from '../../components/map/map.component';
import { ApiService2 } from '../../../services/proyect2/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MapModalComponent } from '../../components/map/map-modal.component'; // Ajusta la ruta según tu estructura
import { MatIcon } from '@angular/material/icon';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    SweetAlert2Module,
    MatIcon,
    MatNativeDateModule,
    MatDatepickerModule,
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent implements OnInit {
  formGrupo: FormGroup;
  result:any;
  // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
  private readonly _currentYear = new Date().getFullYear();
  private readonly _today = new Date();
  readonly maxDate = new Date(this._today.getFullYear(), this._today.getMonth(), this._today.getDate());

  constructor(private fb: FormBuilder, private apiService: ApiService2, private dialog: MatDialog) {
    
    this.formGrupo = this.fb.group({
      paso1: this.fb.group({
        firstName: [''],
        lastName: [''],
        maidenName: [''],
        age: [''],
        gender: [''],
        birthDate: [''],
        bloodGroup: [''],
        height: [''],
        weight: [''],
        eyeColor: [''],
        hair_color: [''],
        hair_type: [''],
        image: ['']
      }),
      paso2: this.fb.group({
        email: [''],
        phone: [''],
        user_name: [''],
        password: [''],
        ip: [''],
        macAddress: [''],
        userAgent: ['']
      }),
      paso3: this.fb.group({
        address_address: [''],
        address_city: [''],
        address_state: [''],
        address_stateCode: [''],
        address_postalCode: [''],
        address_coordinates_lat: [''],
        address_coordinates_lng: [''],
        address_country: [''],
        university: ['']
      }),
      paso4: this.fb.group({
        bank_cardExpire: [''],
        bank_cardNumber: [''],
        bank_cardType: [''],
        bank_currency: [''],
        bank_iban: [''],
        crypto_coin: [''],
        crypto_wallet: [''],
        crypto_network: ['']
      }),
      paso5: this.fb.group({
        company_department: [''],
        company_name: [''],
        company_title: [''],
        company_address_address: [''],
        company_address_city: [''],
        company_address_state: [''],
        company_address_stateCode: [''],
        company_address_postalCode: [''],
        company_address_coordinates_lat: [''],
        company_address_coordinates_lng: [''],
        company_address_country: [''],
        ein: [''],
        ssn: ['']
      })
    });
  }

  get paso1Form(): FormGroup {
    return this.formGrupo.get('paso1') as FormGroup;
  }
  get paso2Form(): FormGroup {
    return this.formGrupo.get('paso2') as FormGroup;
  }
  get paso3Form(): FormGroup {
    return this.formGrupo.get('paso3') as FormGroup;
  }
  get paso4Form(): FormGroup {
    return this.formGrupo.get('paso4') as FormGroup;
  }
  get paso5Form(): FormGroup {
    return this.formGrupo.get('paso5') as FormGroup;
  }

  ngOnInit() {
    console.log('UserComponent initialized');
    this.getUserbyID('2').then(data => {
      console.log('User data fetched:', data);
      if (data) {
        this.paso1Form.patchValue(filterFormValues(this.paso1Form, data.data));
        this.paso2Form.patchValue(filterFormValues(this.paso2Form, data.data));
        this.paso3Form.patchValue(filterFormValues(this.paso3Form, data.data));
        this.paso4Form.patchValue(filterFormValues(this.paso4Form, data.data));
        this.paso5Form.patchValue(filterFormValues(this.paso5Form, data.data));
      }
    });
  }

  

  async testUpdateUser(id:string,data:any) { //✅
          this.result = await this.apiService.updateUser(id, data);
    
  }

  onSubmit() {
    const userdata = cleanObject({
      ...this.paso1Form.value,
      ...this.paso2Form.value,
      ...this.paso3Form.value,
      ...this.paso4Form.value,
      ...this.paso5Form.value
    });
    this.testUpdateUser('2',userdata ).then(() => {
      console.log('User updated successfully');
    }).catch((error) => {
      console.error('Error updating user:', error);
    }); 
  }

  async confirmAndSubmit() {
    const result = await Swal.fire({
      title: 'Desea Enviar los datos?',
      text: 'Tus datos serán actualizados.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      this.onSubmit();
    }
  }

  openMapModal() {
      const dialogRef = this.dialog.open(MapModalComponent, {
        width: '100vw',
        height: '90vh',
        maxWidth: '100vw',
        panelClass: 'full-screen-modal',
        disableClose: false // Permite cerrar haciendo click fuera
      });

      setTimeout(() => {
        (document.activeElement as HTMLElement)?.blur();
      }, 0);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.onUbicationSelected(result);
        }
      });
    }


  onUbicationSelected(ubication: any) {
  if (ubication) {
    this.paso3Form.patchValue({
      address_address: ubication.adress || '',
      address_state: ubication.state || '',
      address_stateCode: ubication.stateCode || '',
      address_coordinates_lat: ubication.lat || '',
      address_coordinates_lng: ubication.lng || '',
      address_country: ubication.country || '',
      address_city: ubication.city || '',
      university: ubication.university || ''
    });
  }
}


openCompanyMapModal() {
  const dialogRef = this.dialog.open(MapModalComponent, {
    width: '100vw',
    height: '90vh',
    maxWidth: '100vw',
    panelClass: 'full-screen-modal',
    disableClose: false
  });

  setTimeout(() => {
    (document.activeElement as HTMLElement)?.blur();
  }, 0);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.onCompanyUbicationSelected(result);
    }
  });
}

onCompanyUbicationSelected(ubication: any) {
  if (ubication) {
    this.paso5Form.patchValue({
      company_address_address: ubication.adress || '',
      company_address_state: ubication.state || '',
      company_address_stateCode: ubication.stateCode || '',
      company_address_coordinates_lat: ubication.lat || '',
      company_address_coordinates_lng: ubication.lng || '',
      company_address_country: ubication.country || '',
      company_address_city: ubication.city || '',
      // Puedes agregar más campos si lo necesitas
    });
  }
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

}




function cleanObject(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null && v !== '')
  );
}

function filterFormValues(form: FormGroup, data: any) {
  const filtered: any = {};
  Object.keys(form.controls).forEach(key => {
    if (data && data.hasOwnProperty(key)) {
      filtered[key] = data[key];
    }
  });
  return filtered;
}



