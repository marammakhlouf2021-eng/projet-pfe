import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-creercompte',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink, RouterLinkActive, RouterModule],
  templateUrl: './creercompte.component.html',
  styleUrl: './creercompte.component.css'
})
export class CreercompteComponent {

  demande = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: '',
    passwordConfirm: '',
    role: ''
  };

  erreur = '';
  succes = '';

  constructor(private api: ApiService, private router: Router) {}

  soumettre() {
    if (!this.demande.nom || !this.demande.email || !this.demande.password || !this.demande.role) {
      this.erreur = "Veuillez remplir tous les champs obligatoires";
      return;
    }
    if (this.demande.password !== this.demande.passwordConfirm) {
      this.erreur = "Les mots de passe ne correspondent pas";
      return;
    }

    const data = {
      nom: this.demande.nom,
      prenom: this.demande.prenom,
      email: this.demande.email,
      telephone: this.demande.telephone,
      password: this.demande.password,
      role: this.demande.role
    };

    this.api.addDemande(data).subscribe({
      next: () => {
        this.succes = "Votre demande a été envoyée ! En attente de validation par l'admin.";
        this.erreur = '';
        this.demande = { nom: '', prenom: '', email: '', telephone: '', password: '', passwordConfirm: '', role: '' };
      },
      error: (err: any) => {
        this.erreur = "Erreur lors de l'envoi de la demande";
        console.log(err);
      }
    });
  }
}