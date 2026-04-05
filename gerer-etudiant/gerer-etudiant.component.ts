import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { BarreNavigationComponent } from '../barre-navigation/barre-navigation.component';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gerer-etudiant',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, BarreNavigationComponent, CommonModule, FormsModule],
  templateUrl: './gerer-etudiant.component.html',
  styleUrl: './gerer-etudiant.component.css'
})
export class GererEtudiantComponent implements OnInit {

  etudiants: any[] = [];
  etudiantModifier: any = null;
  showForm = false;
  nouvelEtu = { nom: '', prenom: '', email: '', telephone: '', password: '' };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.chargerEtudiants();
  }

  chargerEtudiants() {
    this.api.getEtudiants().subscribe({
      next: (data: any) => this.etudiants = data,
      error: (err: any) => console.log(err)
    });
  }

  ajouter() {
    if (!this.nouvelEtu.nom || !this.nouvelEtu.email) {
      alert("Nom et email obligatoires");
      return;
    }
    this.api.addEtudiant(this.nouvelEtu).subscribe({
      next: () => {
        this.nouvelEtu = { nom: '', prenom: '', email: '', telephone: '', password: '' };
        this.showForm = false;
        this.chargerEtudiants();
      },
      error: (err: any) => console.log(err)
    });
  }

  supprimer(id: string) {
    if (confirm("Voulez-vous vraiment supprimer ?")) {
      this.api.deleteEtudiant(id).subscribe({
        next: () => this.chargerEtudiants(),
        error: (err: any) => console.log(err)
      });
    }
  }

  modifier(etu: any) {
    this.etudiantModifier = { ...etu };
  }

  enregistrerModification() {
    this.api.updateEtudiant(this.etudiantModifier._id, this.etudiantModifier).subscribe({
      next: () => {
        this.etudiantModifier = null;
        this.chargerEtudiants();
      },
      error: (err: any) => console.log(err)
    });
  }

  annuler() {
    this.etudiantModifier = null;
  }
}