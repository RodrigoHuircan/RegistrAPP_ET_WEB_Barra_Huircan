import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication.service';
import { FirestoreService } from './services/firestore.service';

interface Docente {
  name: string;
  icon: string;
  redirecTo: string;
}

interface Alumno {
  name: string;
  icon: string;
  redirecTo: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {
  alumno: Alumno[] = [
    {
      name: 'Inicio',
      icon: 'home-outline',
      redirecTo: '/home'
    },
    {
      name: 'Asignaturas',
      icon: 'book-outline',
      redirecTo: 'asignaturas'
    }
  ];
  login: boolean;

  constructor(
    private menu: MenuController,
    public authService: AuthenticationService,
    public router: Router,
    private firestore : FirestoreService
  ) {
    this.authService.stateUser().subscribe(res => {
        if (res){
          console.log('Está logueado');
          this.login = true;
          this.gedatostUser(res.uid)
        }else{
          console.log('No está logueado');
          this.login = true;
        }
    })
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login-docente']);
      this.menu.close();
    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  }

   gedatostUser(uid: string){
      const  path = 'Usuarios';
      const id = uid;
      this.firestore.getCollection
   } 
}
