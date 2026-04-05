import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { BarreNavigationComponent } from '../barre-navigation/barre-navigation.component';

@Component({
  selector: 'app-demandes-comptes',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterModule,BarreNavigationComponent],
  templateUrl: './demandes-comptes.component.html',
  styleUrl: './demandes-comptes.component.css'
})
export class DemandesComptesComponent implements OnInit {

  demandes: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.chargerDemandes();
  }

  chargerDemandes() {
    this.api.getDemandes().subscribe({
      next: (data: any) => this.demandes = data,
      error: (err: any) => console.log(err)
    });
  }

  accepter(id: string) {
    this.api.accepterDemande(id).subscribe({
      next: () => {
        alert("Compte créé avec succès !");
        this.chargerDemandes();
      },
      error: (err: any) => console.log(err)
    });
  }

  refuser(id: string) {
    if (confirm("Refuser cette demande ?")) {
      this.api.refuserDemande(id).subscribe({
        next: () => {
          alert("Demande refusée !");
          this.chargerDemandes();
        },
        error: (err: any) => console.log(err)
      });
    }
  }
}