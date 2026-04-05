import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarreNavigationComponent } from '../barre-navigation/barre-navigation.component';
import { SideAdminisComponent } from '../side-adminis/side-adminis.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-lesetudiants',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule, FormsModule, BarreNavigationComponent, SideAdminisComponent],
  templateUrl: './lesetudiants.component.html',
  styleUrl: './lesetudiants.component.css'
})
export class LesetudiantsComponent implements OnInit {

  etudiants: any[] = [];
  classes: any[] = [];
  showForm = false;
  etudiantModifier: any = null;

  nouvelEtudiant = {
    nom: '', prenom: '', email: '',
    telephone: '', password: '', classe: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.chargerEtudiants();
    this.chargerClasses();
  }

  chargerEtudiants() {
    this.api.getEtudiants().subscribe({
      next: (data: any) => this.etudiants = data,
      error: (err: any) => console.log(err)
    });
  }

  chargerClasses() {
    this.api.getClasses().subscribe({
      next: (data: any) => this.classes = data,
      error: (err: any) => console.log(err)
    });
  }

  ajouterEtudiant() {
    if (!this.nouvelEtudiant.nom || !this.nouvelEtudiant.email || !this.nouvelEtudiant.classe) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }
    this.api.addEtudiant(this.nouvelEtudiant).subscribe({
      next: () => {
        this.nouvelEtudiant = { nom: '', prenom: '', email: '', telephone: '', password: '', classe: '' };
        this.showForm = false;
        this.chargerEtudiants();
      },
      error: (err: any) => console.log(err)
    });
  }

  modifier(etu: any) {
    this.etudiantModifier = { ...etu, classe: etu.classe?._id || etu.classe };
  }

  enregistrer() {
    this.api.updateEtudiant(this.etudiantModifier._id, this.etudiantModifier).subscribe({
      next: () => {
        this.etudiantModifier = null;
        this.chargerEtudiants();
      },
      error: (err: any) => console.log(err)
    });
  }

  supprimer(id: string) {
    if (confirm("Supprimer cet étudiant ?")) {
      this.api.deleteEtudiant(id).subscribe({
        next: () => this.chargerEtudiants(),
        error: (err: any) => console.log(err)
      });
    }
  }
}