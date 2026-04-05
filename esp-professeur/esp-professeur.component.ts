import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { SidebarProfesseurComponent } from '../sidebar-professeur/sidebar-professeur.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-esp-professeur',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterModule, SidebarProfesseurComponent],
  templateUrl: './esp-professeur.component.html',
  styleUrl: './esp-professeur.component.css'
})
export class EspProfesseurComponent implements OnInit {

  professeur: any = null;
  emplois: any[] = [];
  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  heures = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    const data = localStorage.getItem('professeur');
    if (data) {
      this.professeur = JSON.parse(data);
      this.chargerEmploi();
    }
  }

  chargerEmploi() {
  this.api.getEmploiByProfesseur(this.professeur._id).subscribe({
    next: (data: any) => {
      console.log('emplois:', data);
      this.emplois = data;
    },
    error: (err: any) => console.log(err)
  });
}

  getCellule(jour: string, heure: string) {
    return this.emplois.find(e => e.jour === jour && e.heureDebut === heure);
  }





  
}