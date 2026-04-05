import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { SidebarEtudiantComponent } from '../sidebar-etudiant/sidebar-etudiant.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-esp-etudiant',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterModule, SidebarEtudiantComponent],
  templateUrl: './esp-etudiant.component.html',
  styleUrl: './esp-etudiant.component.css'
})
export class EspEtudiantComponent implements OnInit {

  etudiant: any = null;
  emplois: any[] = [];
  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  heures = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    const data = localStorage.getItem('etudiant');
    if (data) {
      this.etudiant = JSON.parse(data);
      this.chargerEmploi();
    }
  }

  chargerEmploi() {
    const classeId = this.etudiant.classe?._id || this.etudiant.classe;
    this.api.getEmploiByClasse(classeId).subscribe({
      next: (data: any) => this.emplois = data,
      error: (err: any) => console.log(err)
    });
  }

  getCellule(jour: string, heure: string) {
    return this.emplois.find(e => e.jour === jour && e.heureDebut === heure);
  }
}