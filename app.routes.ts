import { Routes } from '@angular/router';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { LoginComponent } from './login/login.component';
import { CreercompteComponent } from './creercompte/creercompte.component';
import { BarreNavigationComponent } from './barre-navigation/barre-navigation.component';

import { DemandesComptesComponent } from './demandes-comptes/demandes-comptes.component';

import { AbsenceComponent } from './absence/absence.component';
import { CreeradminComponent } from './creeradmin/creeradmin.component';
import { AdminComponent } from './admin/admin.component';

import { GererPComponent } from './gerer-p/gerer-p.component';
import { EspAdminisComponent } from './esp-adminis/esp-adminis.component';
import { SideAdminisComponent } from './side-adminis/side-adminis.component';
import { GererAdmsComponent } from './gerer-adms/gerer-adms.component';
import { GererEtudiantComponent } from './gerer-etudiant/gerer-etudiant.component';
import { LesclassesComponent } from './lesclasses/lesclasses.component';
import { LesetudiantsComponent } from './lesetudiants/lesetudiants.component';
import { AffectationsComponent } from './affectations/affectations.component';
import { LesprofsAdminisComponent } from './lesprofs-adminis/lesprofs-adminis.component';
import { EmploidutempsComponent } from './emploidutemps/emploidutemps.component';
import { LoginProfesseurComponent } from './login-professeur/login-professeur.component';
import { EspProfesseurComponent } from './esp-professeur/esp-professeur.component';
import { SaisirNotesComponent } from './saisir-notes/saisir-notes.component';
import { SaisirAbsencesComponent } from './saisir-absences/saisir-absences.component';
import { VoirAbsencesComponent } from './voir-absences/voir-absences.component';
import { LoginEtudiantComponent } from './login-etudiant/login-etudiant.component';
import { EspEtudiantComponent } from './esp-etudiant/esp-etudiant.component';
import { MesNotesComponent } from './mes-notes/mes-notes.component';
import { MesAbsencesComponent } from './mes-absences/mes-absences.component';
import { LoginAdminisComponent } from './login-adminis/login-adminis.component';





export const routes: Routes = [
  { path: '', component: AcceuilComponent, pathMatch: 'full' },
  { path: 'creercompte', component: CreercompteComponent },
  { path: 'login', component: LoginComponent },
  { path: 'barre-navigation', component: BarreNavigationComponent },

  { path: 'voir-absences', component: VoirAbsencesComponent },
 
  { path: 'absence', component: AbsenceComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'creeradmin', component: CreeradminComponent },
 
  { path: 'gerer-p', component: GererPComponent },
  { path: 'esp-adminis', component: EspAdminisComponent },
  { path: 'side-adminis', component: SideAdminisComponent },
  { path: 'gerer-adms', component: GererAdmsComponent },
  { path: 'gerer-etudiant', component: GererEtudiantComponent },
  { path: 'lesclasses', component: LesclassesComponent },
  { path: 'lesetudiants', component: LesetudiantsComponent },
  { path: 'affectations', component: AffectationsComponent },
  { path: 'emploidutemps', component: EmploidutempsComponent },
  { path: 'lesprofs-adminis', component: LesprofsAdminisComponent },
  { path: 'login-professeur', component: LoginProfesseurComponent },
  { path: 'esp-professeur', component: EspProfesseurComponent },
  { path: 'saisir-notes', component: SaisirNotesComponent },
{ path: 'saisir-absences', component: SaisirAbsencesComponent },
{ path: 'login-etudiant', component: LoginEtudiantComponent },
{ path: 'esp-etudiant', component: EspEtudiantComponent },
{ path: 'mes-notes', component: MesNotesComponent },
{ path: 'mes-absences', component: MesAbsencesComponent },
{ path: 'login-adminis', component: LoginAdminisComponent },
{ path: 'demandes-comptes', component: DemandesComptesComponent },





];