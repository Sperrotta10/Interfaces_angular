import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatSelectModule,
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
  imageFileDataUrl: string | null = null;
  
  private readonly _today = new Date();
  readonly maxDate = new Date(this._today.getFullYear(), this._today.getMonth(), this._today.getDate());

  constructor(private fb: FormBuilder, private apiService: ApiService2, private dialog: MatDialog) {
    
    this.formGrupo = this.fb.group({
      paso1: this.fb.group({
        firstName: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'), Validators.maxLength(15)]],
        lastName: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'), Validators.maxLength(15)]],
        maidenName: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'), Validators.maxLength(15)]],
        age: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(0), Validators.max(120)]],
        gender: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        birthDate: ['', Validators.required,],
        bloodGroup: ['', [Validators.pattern('^[a-zA-Z0-9+-]+$'), Validators.maxLength(4)]],
        height: ['', [Validators.pattern('^[0-9]+$'), Validators.maxLength(3)]],
        weight: ['', [Validators.pattern('^[0-9]+$'), Validators.maxLength(3)]],
        eyeColor: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'), Validators.maxLength(10)]],
        hair_color: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'), Validators.maxLength(15)]],
        hair_type: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$'), Validators.maxLength(15)]],
        image: ['']
      }),
      paso2: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.pattern('^[0-9]+$'), Validators.maxLength(15)]],
        user_name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]+$'), Validators.maxLength(15)]],
        ip: ['', [Validators.pattern('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$'), Validators.maxLength(15)]],
        macAddress: ['', [Validators.pattern('^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$')]],
        userAgent: ['']
      }),
      paso3: this.fb.group({
        address_address: [''],
        address_city: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        address_state: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        address_stateCode: ['', [Validators.pattern('^[a-zA-Z0-9]+$')]],
        address_postalCode: ['', [Validators.pattern('^[0-9]+$')]],
        address_coordinates_lat: ['', [Validators.pattern('^-?\\d{1,2}\\.\\d+$')]],
        address_coordinates_lng: ['', [Validators.pattern('^-?\\d{1,3}\\.\\d+$')]],
        address_country: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        university: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]]
      }),
      paso4: this.fb.group({
        bank_cardExpire: [''],
        bank_cardNumber: ['', [Validators.pattern('^[0-9]+$')]],
        bank_cardType: ['', [Validators.pattern('^[a-zA-Z ]+$')]],
        bank_currency: ['', [Validators.pattern('^[A-Z]{3}$')]],
        bank_iban: ['', [Validators.pattern('^[A-Z0-9]+$')]],
        crypto_coin: ['', [Validators.pattern('^[a-zA-Z0-9]+$')]],
        crypto_wallet: [''],
        crypto_network: ['', [Validators.pattern('^[a-zA-Z0-9]+$')]]
      }),
      paso5: this.fb.group({
        company_department: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        company_name: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 ]+$')]],
        company_title: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        company_address_address: [''],
        company_address_city: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        company_address_state: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        company_address_stateCode: ['', [Validators.pattern('^[a-zA-Z0-9]+$')]],
        company_address_postalCode: ['', [Validators.pattern('^[0-9]+$')]],
        company_address_coordinates_lat: ['', [Validators.pattern('^-?\\d{1,2}\\.\\d+$')]],
        company_address_coordinates_lng: ['', [Validators.pattern('^-?\\d{1,3}\\.\\d+$')]],
        company_address_country: ['', [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')]],
        ein: ['', [Validators.pattern('^[0-9]+$')]],
        ssn: ['', [Validators.pattern('^[0-9]+$')]]
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

  get imagePreviewUrl(): string | null {
    if (this.imageFileDataUrl) {
      return this.imageFileDataUrl;
    }
    const url = this.paso1Form.get('image')?.value;
    this.paso1Form.get('image')?.updateValueAndValidity(); // Asegura que el valor se valide correctamente
    if (url && typeof url === 'string' && url.trim() !== '') {
      return url;
    }
    return null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageFileDataUrl = e.target.result;
        this.paso1Form.get('image')?.setValue(this.imageFileDataUrl); // Guarda el base64 en el campo image
      };
      reader.readAsDataURL(file);
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/120x120?text=Sin+imagen';
  }

  ngOnInit() {
    this.paso1Form.get('image')?.valueChanges.subscribe(val => {
      // Si el valor cambia y no es por el input file, limpia el preview local
      if (val && val !== this.imageFileDataUrl) {
        this.imageFileDataUrl = null;
      }
    });
    console.log('UserComponent initialized');
    const UserID = this.getUserID()
    this.getUserbyID(UserID).then(data => {
      if (data) {
        this.paso1Form.patchValue(filterFormValues(this.paso1Form, data.data));
        this.paso2Form.patchValue(filterFormValues(this.paso2Form, data.data));
        this.paso3Form.patchValue(filterFormValues(this.paso3Form, data.data));
        this.paso4Form.patchValue(filterFormValues(this.paso4Form, data.data));
        this.paso5Form.patchValue(filterFormValues(this.paso5Form, data.data));
      }
    });
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

  

  async testUpdateUser(id:string,data:any) { //✅
          this.result = await this.apiService.updateUser(id, data);
    
  }

  async onSubmit() {
      const userdata = cleanObject({
        ...this.paso1Form.value,
        ...this.paso2Form.value,
        ...this.paso3Form.value,
        ...this.paso4Form.value,
        ...this.paso5Form.value
      });
      try {
        const userid = this.getUserID();
        await this.testUpdateUser(userid, userdata);
        await Swal.fire({
          icon: 'success',
          title: '¡Datos actualizados!',
          text: 'Tus datos han sido actualizados correctamente.'
        });
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar los datos.'
        });
      console.error('Error updating user:', error);
    }
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
        width: '80vw',
        height: '90vh',
        maxWidth: '100vw',
        panelClass: 'full-screen-modal',
        disableClose: false, // Permite cerrar haciendo click fuera
        autoFocus: true, // Fuerza el foco en el modal
        restoreFocus: false // No devuelve el foco al botón de apertura
      });

      dialogRef.afterOpened().subscribe(() => {
        // Si el mapa no es enfocable, enfoca el primer botón dentro del modal si existe
        const modal = document.querySelector('.full-screen-modal');
        if (modal) {
          const btn = modal.querySelector('button, [tabindex]:not([tabindex="-1"])');
          if (btn) (btn as HTMLElement).focus();
        }
      });

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
    disableClose: false,
    autoFocus: true,
    restoreFocus: false
  });

  dialogRef.afterOpened().subscribe(() => {
    const modal = document.querySelector('.full-screen-modal');
    if (modal) {
      const btn = modal.querySelector('button, [tabindex]:not([tabindex="-1"])');
      if (btn) (btn as HTMLElement).focus();
    }
  });

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

  private fieldNamesEs: { [key: string]: string } = {
    firstName: 'Nombre',
    lastName: 'Apellido',
    maidenName: 'Segundo apellido',
    age: 'Edad',
    gender: 'Género',
    birthDate: 'Fecha de nacimiento',
    bloodGroup: 'Grupo sanguíneo',
    height: 'Altura',
    weight: 'Peso',
    eyeColor: 'Color de ojos',
    hair_color: 'Color de cabello',
    hair_type: 'Tipo de cabello',
    image: 'Imagen',
    email: 'Correo electrónico',
    phone: 'Teléfono',
    user_name: 'Usuario',
    password: 'Contraseña',
    ip: 'IP',
    macAddress: 'MAC Address',
    userAgent: 'User Agent',
    address_address: 'Dirección',
    address_city: 'Ciudad',
    address_state: 'Estado',
    address_stateCode: 'Código de estado',
    address_postalCode: 'Código postal',
    address_coordinates_lat: 'Latitud',
    address_coordinates_lng: 'Longitud',
    address_country: 'País',
    university: 'Universidad',
    bank_cardExpire: 'Vencimiento tarjeta',
    bank_cardNumber: 'Número de tarjeta',
    bank_cardType: 'Tipo de tarjeta',
    bank_currency: 'Moneda',
    bank_iban: 'IBAN',
    crypto_coin: 'Criptomoneda',
    crypto_wallet: 'Wallet',
    crypto_network: 'Red cripto',
    company_department: 'Departamento',
    company_name: 'Empresa',
    company_title: 'Cargo',
    company_address_address: 'Dirección empresa',
    company_address_city: 'Ciudad empresa',
    company_address_state: 'Estado empresa',
    company_address_stateCode: 'Código estado empresa',
    company_address_postalCode: 'Código postal empresa',
    company_address_coordinates_lat: 'Latitud empresa',
    company_address_coordinates_lng: 'Longitud empresa',
    company_address_country: 'País empresa',
    ein: 'EIN',
    ssn: 'SSN'
  };

  getFormErrors(): string[] {
    const errorFields: string[] = [];
    const steps = [this.paso1Form, this.paso2Form, this.paso3Form, this.paso4Form, this.paso5Form];
    steps.forEach((form, idx) => {
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        if (control && control.invalid) {
          errorFields.push(this.fieldNamesEs[key] || key);
        }
      });
    });
    return errorFields;
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



