import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MapComponent } from './map.component';
import { AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map-modal',
  standalone: true,
  imports: [MapComponent],
  template: `<app-map (ubicationSelected)="onUbicationSelected($event)"></app-map>`,
  styleUrls: ['map-modal.component.css'],
})
export class MapModalComponent {

  @ViewChild(MapComponent) mapComponent!: MapComponent;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.mapComponent && this.mapComponent.map) {
        this.mapComponent.map.invalidateSize();
      }
    }, 300); // Espera a que el modal y el mapa estén renderizados
  }

  constructor(
    public dialogRef: MatDialogRef<MapModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onUbicationSelected(event: any) {
    this.dialogRef.close(event); // Puedes devolver la ubicación seleccionada si lo deseas
  }
}