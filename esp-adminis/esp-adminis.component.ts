import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RouterModule } from '@angular/router';
import { SideAdminisComponent } from '../side-adminis/side-adminis.component';
@Component({
  selector: 'app-esp-adminis',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,RouterModule,SideAdminisComponent],
  templateUrl: './esp-adminis.component.html',
  styleUrl: './esp-adminis.component.css'
})
export class EspAdminisComponent {

}
