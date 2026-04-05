import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { BarreNavigationComponent } from '../barre-navigation/barre-navigation.component';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gerer-p',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, BarreNavigationComponent, CommonModule, FormsModule],
  templateUrl: './gerer-p.component.html',
  styleUrl: './gerer-p.component.css'
})
export class GererPComponent implements OnInit {

  professeurs: any[] = [];
  toutesLesMatieres: any[] = [];
  matieresSelectionnees: string[] = [];
  professeurModifier: any = null;
  showForm = false;

  nouveauProf = { nom: '', prenom: '', email: '', telephone: '', password: '' };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.chargerProfesseurs();
    this.chargerMatieres();
  }

  chargerProfesseurs() {
    this.api.getProfesseurs().subscribe({
      next: (data: any) => this.professeurs = data,
      error: (err) => console.log(err)
    });
  }

  chargerMatieres() {
    this.api.getMatieres().subscribe({
      next: (data: any) => this.toutesLesMatieres = data,
      error: (err) => console.log(err)
    });
  }

  toggleMatiere(matiereId: string) {
    const index = this.matieresSelectionnees.indexOf(matiereId);
    if (index === -1) {
      this.matieresSelectionnees.push(matiereId);
    } else {
      this.matieresSelectionnees.splice(index, 1);
    }
  }

  ajouter() {
    if (!this.nouveauProf.nom || !this.nouveauProf.email) {
      alert("Nom et email obligatoires");
      return;
    }
    const data = {
      ...this.nouveauProf,
      matieresAutorisees: this.matieresSelectionnees
    };
    this.api.addProfesseur(data).subscribe({
      next: () => {
        this.nouveauProf = { nom: '', prenom: '', email: '', telephone: '', password: '' };
        this.matieresSelectionnees = [];
        this.showForm = false;
        this.chargerProfesseurs();
      },
      error: (err) => console.log(err)
    });
  }

  supprimer(id: string) {
    if (confirm("Voulez-vous vraiment supprimer ce professeur ?")) {
      this.api.deleteProfesseur(id).subscribe({
        next: () => this.chargerProfesseurs(),
        error: (err) => console.log(err)
      });
    }
  }

  modifier(prof: any) {
    this.professeurModifier = { ...prof };
  }

  enregistrerModification() {
    this.api.updateProfesseur(this.professeurModifier._id, this.professeurModifier).subscribe({
      next: () => {
        this.professeurModifier = null;
        this.chargerProfesseurs();
      },
      error: (err) => console.log(err)
    });
  }

  annuler() {
    this.professeurModifier = null;
  }
}