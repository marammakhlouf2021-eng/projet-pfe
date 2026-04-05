import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SideAdminisComponent } from '../side-adminis/side-adminis.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-lesprofs-adminis',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule, FormsModule, SideAdminisComponent],
  templateUrl: './lesprofs-adminis.component.html',
  styleUrl: './lesprofs-adminis.component.css'
})
export class LesprofsAdminisComponent implements OnInit {

  professeurs: any[] = [];
  professeursFiltres: any[] = [];
  classes: any[] = [];
  toutesLesMatieres: any[] = [];
  matieresSelectionnees: string[] = [];
  classeSelectionnee: string = '';
  profModifier: any = null;
  showForm = false;

  nouveauProf = {
    nom: '', prenom: '', email: '',
    telephone: '', password: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.chargerProfesseurs();
    this.chargerClasses();
    this.chargerToutesLesMatieres();
  }

  chargerProfesseurs() {
    this.api.getProfesseurs().subscribe({
      next: (data: any) => {
        this.professeurs = data;
        this.professeursFiltres = data;
      },
      error: (err: any) => console.log(err)
    });
  }

  chargerClasses() {
    this.api.getClasses().subscribe({
      next: (data: any) => this.classes = data,
      error: (err: any) => console.log(err)
    });
  }

  chargerToutesLesMatieres() {
    this.api.getMatieres().subscribe({
      next: (data: any) => this.toutesLesMatieres = data,
      error: (err: any) => console.log(err)
    });
  }

  filtrerParClasse() {
    if (!this.classeSelectionnee) {
      this.professeursFiltres = this.professeurs;
    } else if (this.classeSelectionnee === 'sans-classe') {
      this.professeursFiltres = this.professeurs.filter(
        (prof: any) => !prof.matieres || prof.matieres.length === 0
      );
    } else {
      this.professeursFiltres = this.professeurs.filter(
        (prof: any) => prof.matieres?.some(
          (mat: any) => {
            const classeId = mat.classe?._id?.toString() || mat.classe?.toString();
            return classeId === this.classeSelectionnee.toString();
          }
        )
      );
    }
  }

 matieresModifier: string[] = [];

 toggleMatiere(matiereId: string) {
  const index = this.matieresSelectionnees.indexOf(matiereId);
  if (index === -1) {
    this.matieresSelectionnees.push(matiereId);
  } else {
    this.matieresSelectionnees.splice(index, 1);
  }
}
ajouterProf() {
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
    error: (err: any) => console.log(err)
  });
}

modifier(prof: any) {
  this.profModifier = { ...prof };
  this.matieresModifier = prof.matieresAutorisees?.map(
    (m: any) => m._id || m
  ) || [];
}

toggleMatiereModifier(matiereId: string) {
  const index = this.matieresModifier.indexOf(matiereId);
  if (index === -1) {
    this.matieresModifier.push(matiereId);
  } else {
    this.matieresModifier.splice(index, 1);
  }
}

enregistrer() {
  this.api.updateProfesseur(this.profModifier._id, {
    nom: this.profModifier.nom,
    prenom: this.profModifier.prenom,
    email: this.profModifier.email,
    telephone: this.profModifier.telephone
  }).subscribe({
    next: () => {
      // Mettre à jour les matières autorisées
      this.api.updateMatieresAutorisees(this.profModifier._id, this.matieresModifier).subscribe({
        next: () => {
          this.profModifier = null;
          this.matieresModifier = [];
          this.chargerProfesseurs();
        }
      });
    },
    error: (err: any) => console.log(err)
  });
}
  supprimer(id: string) {
    if (confirm("Supprimer ce professeur ?")) {
      this.api.deleteProfesseur(id).subscribe({
        next: () => this.chargerProfesseurs(),
        error: (err: any) => console.log(err)
      });
    }
  }
 get matiereGroupees(): any[] {
  const map: any = {};
  this.toutesLesMatieres.forEach((mat: any) => {
    const nom = mat.nom;
    if (!map[nom]) {
      map[nom] = {
        nom: nom,
        items: []
      };
    }
    map[nom].items.push(mat);
  });
  return Object.values(map);
}

toggleMatiereGroupe(ids: string[]) {
  ids.forEach(id => {
    const index = this.matieresSelectionnees.indexOf(id);
    if (index === -1) {
      this.matieresSelectionnees.push(id);
    } else {
      this.matieresSelectionnees.splice(index, 1);
    }
  });
}

isGroupeSelectionne(ids: string[]): boolean {
  return ids.some(id => this.matieresSelectionnees.includes(id));
}
isGroupeSelectionneModifier(ids: string[]): boolean {
  return ids.some(id => this.matieresModifier.includes(id));
}

toggleMatiereGroupeModifier(ids: string[]) {
  ids.forEach(id => {
    const index = this.matieresModifier.indexOf(id);
    if (index === -1) {
      this.matieresModifier.push(id);
    } else {
      this.matieresModifier.splice(index, 1);
    }
  });
}
}