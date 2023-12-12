import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/authentication.service';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  email: string = '';
  enviado: boolean = false; // Es para ver si se envió el correo

  constructor(public authService: AuthenticationService, 
              public route: Router,
              public interaction : InteractionService,
              public firestore: AngularFirestore) {}

  ngOnInit() {}

  async resetPassword() {
    try {
      if (this.email.trim() === '') {
        console.error('El campo de correo electrónico no puede estar vacío.');
        this.interaction.presentAlert('Ingresa un correo válido')
        return;
      }

      await this.authService.resetPass(this.email);
      console.log('Enlace de restablecimiento enviado correctamente');
      const userDoc = this.firestore.collection('users').doc(this.email);
      await userDoc.update({
        passwordReset: true,
      });
      this.enviado = true;
      this.interaction.presentAlert('Enlace de restableciemiento enviado correctamente')
      this.email = ''; // Limpiar el campo de correo electrónico después de enviar el correo
    } catch (error) {
      console.log(error);
    }
  }
}
