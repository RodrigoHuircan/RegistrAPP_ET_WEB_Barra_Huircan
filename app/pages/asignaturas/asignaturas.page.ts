import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { InteractionService } from 'src/app/services/interaction.service';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.page.html',
  styleUrls: ['./asignaturas.page.scss'],
})
export class AsignaturasPage implements OnInit{
  asignaturaForm: FormGroup;
  userId: any;
  constructor(
    private formBuilder: FormBuilder,
    private firestoreService: FirestoreService,
    private authService: AuthenticationService,
    private auth: AngularFireAuth,
    private interaction: InteractionService
  ) {
    this.asignaturaForm = this.formBuilder.group({
      asignatura: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Obtén el objeto de usuario actual
    this.auth.authState.subscribe(user => {
      if (user) {
        const userId = user.uid;
        this.userId =  userId;
        console.log('User ID:', userId);

      }
    });
  }

  async agregarAsignatura() {
    const asignatura = this.asignaturaForm.get('asignatura').value;
    // Obtener el UID del usuario actual

    // Actualizar la base de datos Firestore
    await this.firestoreService.agregarAsignatura(this.userId, asignatura);

    // Limpiar el formulario después de agregar la asignatura
    this.asignaturaForm.reset();
    this.interaction.presentAlert('Asignatura Agregada Correctamente')

  }
}