import { Component, OnInit, Output, EventEmitter } from '@angular/core';

declare let L: any; // Assuming Leaflet is globally available

export interface Marker{
  id: number;
  lat: number;
  lng: number;
  title: string;
  icon:string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  map: any;
  currentMarker: any = null;
  @Output() ubicationSelected = new EventEmitter<any>();

  ngOnInit() {
    
    console.log('MapComponent initialized');
    this.initMap();
  }
  initMap() {
    const googleSat=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
      detectRetina: true,
      subdomains: 'abc',
    });

    const bounds = {
      north: 10.16202,
      east: -68.00765,
      south: 10.16202,
      west: -68.00765
    };

    const southWest = L.latLng(bounds.south, bounds.west);
    const northEast = L.latLng(bounds.north, bounds.east);
    const fitBounds = L.latLngBounds(southWest, northEast);

    this.map = L.map('map',{
      center: southWest,
      zoom: 14,
      minZoom:2,
      maxZoom:22,
      layers: [googleSat]
    });

    // Listener para crear un solo marcador y obtener info de país/ciudad
    this.map.on('click', async (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      // Elimina el marcador anterior si existe
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
      }
      let adress = '', state = '', postcode = '', country = '', city = '', university = '';
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
          {
            headers: {
              'Accept-Language': 'es'
            }
          }
        );
        if (!response.ok) throw new Error('Error en la respuesta de Nominatim');
        const data = await response.json();
        adress = data.name ||  data.address?.quarter || data.address?.neighbourhood ||  data.address?.suburb || '';
        state = data.address?.state || '';
        postcode = data.address?.postcode || '';
        country = data.address?.country || '';
        city = data.address?.city || data.address?.county ||'';
        university = data.address?.amenity || '';

        // Crea el nuevo marcador
      this.currentMarker = L.marker([lat, lng]).addTo(this.map)
        .bindPopup(`Marcador en:<br>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}<br>País: ${country}<br>Ciudad: ${city}`)
        .openPopup();

      const ubication_data ={
        adress: adress,
        state: state,
        stateCode: postcode,
        lat: lat,
        lng: lng,
        country: country,
        city: city,
        university: university
      }
      this.ubicationSelected.emit(ubication_data);
      } catch (error) {
        console.error('Error al obtener datos de Nominatim:', error);
        // Opcional: muestra un mensaje al usuario o emite un evento de error
      }
      
    });

    
    

  }
}
