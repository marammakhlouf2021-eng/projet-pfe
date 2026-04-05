import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { ProfilComponent } from '../profil/profil.component';

@Component({
  selector: 'app-absence',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,RouterModule,ProfilComponent],
  templateUrl: './absence.component.html',
  styleUrl: './absence.component.css'
})
export class AbsenceComponent {

}
