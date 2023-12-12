import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { InteractionService } from 'src/app/services/interaction.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-login-docente',
  templateUrl: './login-docente.page.html',
  styleUrls: ['./login-docente.page.scss'],
})
export class LoginDocentePage implements OnInit {


  credenciales = {
    email: null,
    password: null,


  };

  constructor(private auth: AuthenticationService,
              private interaction : InteractionService,
              private router : Router,
              private firestore: AngularFirestore) {}

  ngOnInit() {}


  async login() {
    try {
      await this.interaction.presentLoading('Iniciando sesión');
      console.log('credenciales -> ', this.credenciales);
      
      const res = await this.auth.loginUser(this.credenciales.email, this.credenciales.password);
      
      if (res) {
        const uid = res.user.uid;
        const profileDoc = await this.firestore.collection('Usuarios').doc(uid).get().toPromise();
    
        if (profileDoc.exists) {
          const data: any = profileDoc.data();  // Usa 'any' para el tipo de data
    
          // Verifica si 'Usuarios' existe en el objeto data
          if ('usuario' in data) {
            const tipoCuenta = data.usuario;
    
            if (tipoCuenta === 'docente') {
              console.log('UID del usuario', uid)
              this.handleSuccessfulLogin();
            } else {
              await this.auth.signOut();
              this.interaction.presentToast('Acceso no autorizado, solo pueden ingresar docentes');
            }
          } else {
            console.error('La propiedad "Usuarios" no existe en el perfil del usuario');
            await this.auth.signOut();
            this.interaction.presentToast('Error al obtener el perfil del usuario');
          }
        } else {
          console.error('El perfil del usuario no existe en Firestore');
          await this.auth.signOut();
          this.interaction.presentToast('Error al obtener el perfil del usuario');
        }
      }
    
      this.interaction.closeLoading();
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      this.interaction.closeLoading();
      this.interaction.presentToast('El email o contraseña inválido');
    }
  }
  
  
  private handleSuccessfulLogin(): void {
    console.log('Inicio de sesión exitoso. Redirigiendo...');
    this.router.navigate(['/home']);
  }
  
}