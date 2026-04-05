import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarreNavigationComponent } from '../barre-navigation/barre-navigation.component';
import { SideAdminisComponent } from '../side-adminis/side-adminis.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-lesclasses',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, SideAdminisComponent, CommonModule, FormsModule, BarreNavigationComponent],
  templateUrl: './lesclasses.component.html',
  styleUrl: './lesclasses.component.css'
})
export class LesclassesComponent implements OnInit {

  classes: any[] = [];
  professeurs: any[] = [];
  matieresByClasse: { [key: string]: any[] } = {};

  showFormClasse = false;
  showFormMatiere: { [key: string]: boolean } = {};

  nouvelleClasse = { nom: '', niveau: '' };
  classeModifier: any = null;

  nouvelleMatiere: any = { nom: '', coefficient: 1, classe: '', professeur: '', profsAutorises: [] };
  matiereModifier: any = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.chargerClasses();
    this.chargerProfesseurs();
  }

  chargerClasses() {
    this.api.getClasses().subscribe({
      next: (data: any) => {
        this.classes = data;
        data.forEach((cls: any) => this.chargerMatieres(cls._id));
      },
      error: (err: any) => console.log(err)
    });
  }

  chargerProfesseurs() {
    this.api.getProfesseurs().subscribe({
      next: (data: any) => this.professeurs = data,
      error: (err: any) => console.log(err)
    });
  }

  chargerMatieres(classeId: string) {
    this.api.getMatieresByClasse(classeId).subscribe({
      next: (data: any) => this.matieresByClasse[classeId] = data,
      error: (err: any) => console.log(err)
    });
  }

  toggleProfAutorise(profId: string) {
    if (!this.nouvelleMatiere.profsAutorises) {
      this.nouvelleMatiere.profsAutorises = [];
    }
    const index = this.nouvelleMatiere.profsAutorises.indexOf(profId);
    if (index === -1) {
      this.nouvelleMatiere.profsAutorises.push(profId);
    } else {
      this.nouvelleMatiere.profsAutorises.splice(index, 1);
    }
  }

  getProfsPourNouvelleMatiere(): any[] {
    if (!this.nouvelleMatiere.profsAutorises?.length) return this.professeurs;
    return this.professeurs.filter((prof: any) =>
      this.nouvelleMatiere.profsAutorises.includes(prof._id)
    );
  }

  getProfsPourMatiere(nomMatiere: string): any[] {
    if (!nomMatiere) return this.professeurs;
    let matiereObj: any = null;
    for (const classeId in this.matieresByClasse) {
      const found = this.matieresByClasse[classeId].find(
        (m: any) => m.nom.toLowerCase() === nomMatiere.toLowerCase()
      );
      if (found) { matiereObj = found; break; }
    }
    if (matiereObj?.profsAutorises?.length > 0) {
      return this.professeurs.filter((prof: any) =>
        matiereObj.profsAutorises.some(
          (p: any) => (p._id || p).toString() === prof._id.toString()
        )
      );
    }
    return this.professeurs;
  }

  ajouterClasse() {
    if (!this.nouvelleClasse.nom || !this.nouvelleClasse.niveau) return;
    this.api.addClasse(this.nouvelleClasse).subscribe({
      next: () => {
        this.nouvelleClasse = { nom: '', niveau: '' };
        this.showFormClasse = false;
        this.chargerClasses();
      },
      error: (err: any) => console.log(err)
    });
  }

  modifierClasse(cls: any) {
    this.classeModifier = { ...cls };
  }

  enregistrerClasse() {
    this.api.updateClasse(this.classeModifier._id, this.classeModifier).subscribe({
      next: () => {
        this.classeModifier = null;
        this.chargerClasses();
      },
      error: (err: any) => console.log(err)
    });
  }

  supprimerClasse(id: string) {
    if (confirm("Supprimer cette classe ?")) {
      this.api.deleteClasse(id).subscribe({
        next: () => this.chargerClasses(),
        error: (err: any) => console.log(err)
      });
    }
  }

  ajouterMatiere(classeId: string) {
    if (!this.nouvelleMatiere.nom) return;
    this.nouvelleMatiere.classe = classeId;
    this.api.addMatiere(this.nouvelleMatiere).subscribe({
      next: () => {
        this.nouvelleMatiere = { nom: '', coefficient: 1, classe: '', professeur: '', profsAutorises: [] };
        this.showFormMatiere[classeId] = false;
        this.chargerMatieres(classeId);
      },
      error: (err: any) => console.log(err)
    });
  }

  modifierMatiere(mat: any) {
    this.matiereModifier = {
      _id: mat._id?.toString() || mat._id,
      nom: mat.nom,
      coefficient: mat.coefficient,
      classe: mat.classe?._id || mat.classe,
      professeur: mat.professeur?._id || mat.professeur,
      profsAutorises: mat.profsAutorises?.map((p: any) => p._id || p) || []
    };
  }

  enregistrerMatiere() {
    const data = {
      nom: this.matiereModifier.nom,
      coefficient: this.matiereModifier.coefficient,
      classe: this.matiereModifier.classe?._id || this.matiereModifier.classe,
      professeur: this.matiereModifier.professeur?._id || this.matiereModifier.professeur,
      profsAutorises: this.matiereModifier.profsAutorises
    };
    this.api.updateMatiere(this.matiereModifier._id, data).subscribe({
      next: () => {
        this.matiereModifier = null;
        this.chargerClasses();
      },
      error: (err: any) => console.log(err)
    });
  }

  supprimerMatiere(id: string, classeId: string) {
    if (confirm("Supprimer cette matière ?")) {
      this.api.deleteMatiere(id).subscribe({
        next: () => this.chargerMatieres(classeId),
        error: (err: any) => console.log(err)
      });
    }
  }
}