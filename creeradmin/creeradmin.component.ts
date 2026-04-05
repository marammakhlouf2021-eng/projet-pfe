import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';

import { RouterLink, RouterLinkActive } from '@angular/router';



@Component({

  selector: 'app-creeradmin',

  standalone: true,

  imports: [ FormsModule, HttpClientModule, RouterLink,RouterLinkActive],

  templateUrl: './creeradmin.component.html',

  styleUrls: ['./creeradmin.component.css']

})

export class CreeradminComponent {
admin = {
nom: '',
prenom: '',
email: '',
telephone: ''

};


constructor(private http: HttpClient) {}

addAdmin() {

this.http.post('http://localhost:3000/add-admin', this.admin).subscribe({
next: (res: any) => {console.log(res);
alert("Admin ajouté avec succès");

},

error: (err: any) => {

console.log(err);

alert("Erreur serveur");

}

});

}

}