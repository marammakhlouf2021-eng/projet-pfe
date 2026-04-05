import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideAdminisComponent } from '../side-adminis/side-adminis.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-emploidutemps',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule, FormsModule, SideAdminisComponent],
  templateUrl: './emploidutemps.component.html',
  styleUrl: './emploidutemps.component.css'
})
export class EmploidutempsComponent implements OnInit {

  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  heures = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  classes: any[] = [];
  matieres: any[] = [];
  professeurs: any[] = [];
  emplois: any[] = [];

  classeSelectionnee: string = '';
  showForm = false;

  nouvelEmploi = {
    classe: '',
    jour: '',
    heureDebut: '',
    heureFin: '',
    matiere: '',
    professeur: '',
    salle: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.chargerClasses();
    this.chargerMatieres();
    this.chargerProfesseurs();
  }

  chargerClasses() {
    this.api.getClasses().subscribe({
      next: (data: any) => this.classes = data,
      error: (err: any) => console.log(err)
    });
  }

  chargerMatieres() {
    this.api.getMatieres().subscribe({
      next: (data: any) => this.matieres = data,
      error: (err: any) => console.log(err)
    });
  }

  chargerProfesseurs() {
    this.api.getProfesseurs().subscribe({
      next: (data: any) => this.professeurs = data,
      error: (err: any) => console.log(err)
    });
  }

  matieresFiltrees: any[] = [];

chargerEmploi() {
  if (!this.classeSelectionnee) return;
  this.api.getEmploiByClasse(this.classeSelectionnee).subscribe({
    next: (data: any) => this.emplois = data,
    error: (err: any) => console.log(err)
  });
  // Filtrer les matières de cette classe
  this.matieresFiltrees = this.matieres.filter(
    (mat: any) => (mat.classe?._id || mat.classe) === this.classeSelectionnee
  );
}
  getCellule(jour: string, heure: string) {
    return this.emplois.find(e =>
      e.jour === jour &&
      e.heureDebut === heure
    );
  }


  supprimer(id: string) {
    if (confirm("Supprimer ce créneau ?")) {
      this.api.deleteEmploi(id).subscribe({
        next: () => this.chargerEmploi(),
        error: (err: any) => console.log(err)
      });
    }
  }
  onMatiereChange() {
  const matiere = this.matieresFiltrees.find(
    (m: any) => m._id === this.nouvelEmploi.matiere
  );
  if (matiere?.professeur) {
    this.nouvelEmploi.professeur = matiere.professeur._id || matiere.professeur;
  }
}
ajouterEmploi() {
  // Assigner la classe sélectionnée
  this.nouvelEmploi.classe = this.classeSelectionnee;
  
  if (!this.nouvelEmploi.jour || !this.nouvelEmploi.heureDebut || !this.nouvelEmploi.matiere) {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }

  this.api.addEmploi(this.nouvelEmploi).subscribe({
    next: () => {
      this.showForm = false;
      this.nouvelEmploi = { classe: '', jour: '', heureDebut: '', heureFin: '', matiere: '', professeur: '', salle: '' };
      this.chargerEmploi();
    },
    error: (err: any) => {
      alert(err.error?.message || "Erreur lors de l'ajout");
    }
  });
}

}