import { Component,ViewChild } from '@angular/core';
import {CarouselModule} from 'ngx-owl-carousel-o'
import { OwlOptions} from 'ngx-owl-carousel-o';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CarouselModule,CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  testimonialImages = [
    'img/carousel/testimonial-1.jpg',
    'img/carousel/testimonial-2.jpg',
    'img/carousel/testimonial-3.jpg',
    'img/carousel/testimonial-4.jpg',
    'img/carousel/testimonial-5.jpg',
  ];

  customOptions: OwlOptions = {
    items:3,
    autoplay:true,
    loop: true,
    margin:10, //esta bien
    dots: false, //esta bien
    navSpeed: 600,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      },
      1200: { items: 3 }  // 超大屏幕也保持3个
    },
    nav:true
  }
}
