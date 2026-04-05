import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login-adminis',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-adminis.component.html',
  styleUrl: './login-adminis.component.css'
})
export class LoginAdminisComponent {

  email = '';
  password = '';
  erreur = '';

  showForgotPassword = false;
  emailOublie = '';
  messageForgot = '';
  erreurForgot = '';

  constructor(private api: ApiService, private router: Router) {}

  seConnecter() {
    if (!this.email || !this.password) {
      this.erreur = "Veuillez remplir tous les champs";
      return;
    }
    this.api.loginAdministration({ email: this.email, password: this.password }).subscribe({
      next: (data: any) => {
        localStorage.setItem('administration', JSON.stringify(data.administration));
        this.router.navigate(['/esp-adminis']);
      },
      error: () => this.erreur = "Email ou mot de passe incorrect"
    });
  }

  envoyerMotDePasse() {
    if (!this.emailOublie) {
      this.erreurForgot = "Veuillez saisir votre email";
      return;
    }
    this.api.forgotPasswordAdministration(this.emailOublie).subscribe({
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