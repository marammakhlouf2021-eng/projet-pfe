import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  email: string = ''; 
  password: string = '';

  constructor(private api: ApiService, private router: Router) {}  // ← Router ajouté

  login() {
    if (!this.email || !this.password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    this.api.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        console.log("Success:", res);
        this.router.navigate(['/gerer-p']);  // ← navigation ici
      },
      error: (err: any) => {
        console.log("Error:", err);
        alert(err?.error?.message || "email ou mot de passe incorrect");
      }
    });
  }
}