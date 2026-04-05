import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login-etudiant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-etudiant.component.html',
  styleUrl: './login-etudiant.component.css'
})
export class LoginEtudiantComponent {

  email = '';
  password = '';
  erreur = '';

  constructor(private api: ApiService, private router: Router) {}

  seConnecter() {
    if (!this.email || !this.password) {
      this.erreur = "Veuillez remplir tous les champs";
      return;
    }
    this.api.loginEtudiant({ email: this.email, password: this.password }).subscribe({
      next: (data: any) => {
        localStorage.setItem('etudiant', JSON.stringify(data.etudiant));
        this.router.navigate(['/esp-etudiant']);
      },
     error: (err: any) => {
  console.log('erreur:', err);
  this.erreur = "Email ou mot de passe incorrect";
}
    });
  }
showForgotPassword = false;
emailOublie = '';
messageForgot = '';
erreurForgot = '';

envoyerMotDePasse() {
  if (!this.emailOublie) {
    this.erreurForgot = "Veuillez saisir votre email";
    return;
  }
  this.api.forgotPasswordEtudiant(this.emailOublie).subscribe({
    next: (data: any) => {
      this.messageForgot = data.message;
      this.erreurForgot = '';
    },
    error: (err: any) => {
      this.erreurForgot = err.error?.message || "Email introuvable";
      this.messageForgot = '';
    }
  });
}
}