import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { BarreNavigationComponent } from '../barre-navigation/barre-navigation.component';
import { ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gerer-adms',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, BarreNavigationComponent, CommonModule, FormsModule],
  templateUrl: './gerer-adms.component.html',
  styleUrl: './gerer-adms.component.css'
})
export class GererAdmsComponent implements OnInit {

  administrations: any[] = [];
  administrationModifier: any = null;
  showForm = false;
  nouvelleAdm = { nom: '', prenom: '', email: '', telephone: '', password: '' };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.chargerAdministrations();
  }

  chargerAdministrations() {
    this.api.getAdministrations().subscribe({
      next: (data: any) => this.administrations = data,
      error: (err: any) => console.log(err)
    });
  }

  ajouter() {
    if (!this.nouvelleAdm.nom || !this.nouvelleAdm.email) {
      alert("Nom et email obligatoires");
      return;
    }
    this.api.addAdministration(this.nouvelleAdm).subscribe({
      next: () => {
        this.nouvelleAdm = { nom: '', prenom: '', email: '', telephone: '', password: '' };
        this.showForm = false;
        this.chargerAdministrations();
      },
      error: (err: any) => console.log(err)
    });
  }

  supprimer(id: string) {
    if (confirm("Voulez-vous vraiment supprimer ?")) {
      this.api.deleteAdministration(id).subscribe({
        next: () => this.chargerAdministrations(),
        error: (err: any) => console.log(err)
      });
    }
  }

  modifier(adm: any) {
    this.administrationModifier = { ...adm };
  }

  enregistrerModification() {
    this.api.updateAdministration(this.administrationModifier._id, this.administrationModifier).subscribe({
      next: () => {
        this.administrationModifier = null;
        this.chargerAdministrations();
      },
      error: (err: any) => console.log(err)
    });
  }

  annuler() {
    this.administrationModifier = null;
  }
}