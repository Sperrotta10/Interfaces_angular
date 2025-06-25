import { ChangeDetectionStrategy,Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatNativeDateModule} from '@angular/material/core';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
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

export class UserComponent {
  formGrupo: FormGroup;

  // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
  private readonly _currentYear = new Date().getFullYear();
  private readonly _today = new Date();
  readonly maxDate = new Date(this._today.getFullYear(), this._today.getMonth(), this._today.getDate());

  constructor(private fb: FormBuilder) {
    
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

  
  onSubmit() {
    console.log(this.formGrupo.value);
  }
}
