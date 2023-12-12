import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UsuarioI } from 'src/app/models/models';
import { InteractionService } from 'src/app/services/interaction.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-docente',
  templateUrl: './registro-docente.page.html',
  styleUrls: ['./registro-docente.page.scss'],
})
export class RegistroDocentePage implements OnInit {
  data: UsuarioI = {
    fullname: '',
    email: '',
    uid: '',
    password: '',
    usuario: '',
    asignaturas: [],
  };

  registroForm: FormGroup;

  constructor(
    private database: FirestoreService,
    private interaction: InteractionService,
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registroForm = this.formBuilder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      asignaturas: this.formBuilder.array([''],[this.validateAsignaturas]), // El FormArray ahora tiene una asignatura inicial requerida
    });
  }

  get asignaturas(): FormArray {
    return this.registroForm.get('asignaturas') as FormArray;
  }

  agregarAsignatura() {
    this.asignaturas.push(this.formBuilder.control(''));
  }

  quitarAsignatura(index: number) {
    this.asignaturas.removeAt(index);
  }

  validateAsignaturas(control: FormArray) {
    const asignaturas = control.value;
    const algunaAsignaturaVacia = asignaturas.some((asignatura) => asignatura.trim() === '');

    return algunaAsignaturaVacia ? { noAsignaturas: true } : null;
  }

  async crearUsuario(form: FormGroup) {
    if (form.valid) {
      this.data = form.value;
      this.data.asignaturas = this.asignaturas.value.filter((asignatura) => asignatura.trim() !== ''); // Filtrar asignaturas vacías
      console.log(this.data);
      this.interaction.presentLoading('Guardando...');
      const path = 'Usuarios';
      const id = this.database.getId();
      this.data.uid = id;
      this.data.usuario = 'docente';
      this.database.crearDoc(this.data, path, id).then((resp) => {
        console.log('esta es la respuesta ->', resp);
        this.interaction.closeLoading();
        this.interaction.presentToast('Guardado con éxito');
      });
    } else {
      // El formulario no es válido, puedes mostrar mensajes de error o realizar acciones adicionales.
    }
  }

  async registrar(form: FormGroup) {
    this.interaction.presentLoading('Registrando');
    try {
      if (form.valid) {
        this.data = form.value;
        this.data.asignaturas = this.asignaturas.value.filter((asignatura) => asignatura.trim() !== ''); // Filtrar asignaturas vacías
        console.log('datos ->', this.data);
        const res = await this.auth.registrarUser(this.data);
        if (res) {
          console.log('Exito');
          const path = 'Usuarios';
          const id = res.user.uid;
          this.data.uid = id;
          this.data.usuario = 'docente';
          await this.database.crearDoc(this.data, path, id);
          this.interaction.presentToast('Registrado');
        }
      }
    } catch (error) {
      console.log('error', error);
      this.interaction.presentAlert('Error Grave, revise la consola');
    } finally {
      this.interaction.closeLoading();
    }
    this.router.navigate(['/home']);
    
  }
}