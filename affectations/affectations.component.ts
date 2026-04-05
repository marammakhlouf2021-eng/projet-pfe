import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideAdminisComponent } from '../side-adminis/side-adminis.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-affectations',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule, FormsModule, SideAdminisComponent],
  templateUrl: './affectations.component.html',
  styleUrl: './affectations.component.css'
})
export class AffectationsComponent implements OnInit {

  etudiants: any[] = [];
  classes: any[] = [];
  classeSelectionnee: string = '';
  etudiantsFiltres: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.chargerEtudiants();
    this.chargerClasses();
  }

  chargerEtudiants() {
    this.api.getEtudiants().subscribe({
      next: (data: any) => {
        this.etudiants = data;
        this.etudiantsFiltres = data;
      },
      error: (err: any) => console.log(err)
    });
  }

  chargerClasses() {
    this.api.getClasses().subscribe({
      next: (data: any) => this.classes = data,
      error: (err: any) => console.log(err)
    });
  }

 filtrerParClasse() {
  if (!this.classeSelectionnee) {
    this.etudiantsFiltres = this.etudiants;
  } else if (this.classeSelectionnee === 'sans-classe') {
    this.etudiantsFiltres = this.etudiants.filter(
      (etu: any) => !etu.classe
    );
  } else {
    this.etudiantsFiltres = this.etudiants.filter(
      (etu: any) => {
        const classeId = etu.classe?._id || etu.classe;
        return classeId === this.classeSelectionnee;
      }
    );
  }
}

  affecter(etudiantId: string, classeId: string) {
    if (!classeId) return;
    this.api.affecterEtudiantClasse(etudiantId, classeId).subscribe({
      next: () => {
        alert("Étudiant affecté avec succès !");
        this.chargerEtudiants();
      },
      error: (err: any) => console.log(err)
    });
  }
  
}