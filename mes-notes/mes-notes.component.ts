import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { SidebarEtudiantComponent } from '../sidebar-etudiant/sidebar-etudiant.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-mes-notes',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterModule, SidebarEtudiantComponent],
  templateUrl: './mes-notes.component.html',
  styleUrl: './mes-notes.component.css'
})
export class MesNotesComponent implements OnInit {

  etudiant: any = null;
  notes: any[] = [];
  types = ['DS1', 'DS2', 'Examen'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    const data = localStorage.getItem('etudiant');
    if (data) {
      this.etudiant = JSON.parse(data);
      this.chargerNotes();
    }
  }

  chargerNotes() {
    this.api.getNotesByEtudiant(this.etudiant._id).subscribe({
      next: (data: any) => this.notes = data,
      error: (err: any) => console.log(err)
    });
  }

  getNoteParType(matiereId: string, type: string) {
    const note = this.notes.find(
      n => (n.matiere?._id || n.matiere) === matiereId && n.type === type
    );
    return note ? note.note : '—';
  }

  getMatieres(): any[] {
    const map: any = {};
    this.notes.forEach(n => {
      const id = n.matiere?._id || n.matiere;
      if (!map[id]) map[id] = n.matiere;
    });
    return Object.values(map);
  }

  pourcentages: any = {
  DS1: 25,
  DS2: 25,
  Examen: 40,
  TP: 10
};

getMoyenne(matiereId: string): string {
  const notesMatiere = this.notes.filter(
    n => (n.matiere?._id || n.matiere) === matiereId
  );
  if (!notesMatiere.length) return '—';
  
  let total = 0;
  let totalPct = 0;
  
  notesMatiere.forEach((n: any) => {
    const pct = this.pourcentages[n.type] || 0;
    total += n.note * (pct / 100);
    totalPct += pct;
  });
  
  if (totalPct === 0) return '—';
  return (total / (totalPct / 100)).toFixed(2);
}
}