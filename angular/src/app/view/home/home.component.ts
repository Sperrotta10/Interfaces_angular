import { Component } from '@angular/core';
import { BannerComponent } from '../../components/banner/banner.component';
import { AboutSectionComponent } from '../../components/about-section/about-section.component';
import { ServicesSectionComponent } from '../../components/services-section/services-section.component';
import { PortfolioComponent } from '../../components/portfolio/portfolio.component';
import { ContactSectionComponent } from '../../components/contact-section/contact-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BannerComponent, AboutSectionComponent, ServicesSectionComponent, PortfolioComponent, ContactSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
