import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UsuarioI } from 'src/app/models/models';
import { AuthenticationService } from 'src/app/authentication.service';
@Component({
  selector: 'app-generar-qr',
  templateUrl: 'generar-qr.page.html',
  styleUrls: ['generar-qr.page.scss'],
})
export class GenerarQrPage {

  cursos: string[] = ['Programación de BD', 'Programación de Apps Móviles', 'Estadística Descriptiva'];
  salas: string[] = ['Sala 101', 'Sala 102', 'Sala 103'];
  texto: string = '';
  textoSala: string = '';
  nombre: any;
  mostrarQR: boolean = false; // Variable para controlar la visibilidad del código QR
  mostrarError: boolean = false;


  constructor (private router: Router,
              private firestoreService: AngularFirestore,
              private auth: AuthenticationService){
                  this.auth.stateUser().subscribe(res => {
                    if (res){
                      console.log('Está logueado');
                      this.getDatosUser(res.uid)
                    }else{
                      console.log('No está logueado');
                    }
                })
                }

  ionViewWillEnter() {
    // Resetea las variables cada vez que la página está a punto de entrar
    this.texto = '';
    this.textoSala = '';
    this.mostrarQR = false;
    this.mostrarError = false;
  }              
  ngOnInit(){
    this.getDatosUser;
  }

  generarQR() {
    // Validar que el campo no esté vacío
    if (this.texto && this.textoSala) {
      this.mostrarQR = true;
      this.mostrarError = false;
    } else {
      this.mostrarQR = false;
      this.mostrarError = true;
      this.texto = this.texto;
      // Aquí puedes agregar lógica adicional si es necesario antes de generar el código QR
      console.log('Generando QR para: ', this.texto);

      // Puedes agregar aquí la lógica para guardar la información en Firebase si es necesario

      // Cambia el valor de mostrarQR para hacer visible el código QR y deshabilitar la edición del input
      this.mostrarQR = true;
    }
  }

  regresar() {
    // Redirige a la página que desees al presionar el botón "Regresar"
    this.router.navigate(['/home']); // Ajusta la ruta según tu configuración
  }

  getDatosUser(uid: string){
    const path = 'Usuarios';
    const id = uid;
    this.firestoreService.collection<UsuarioI>(path).doc(id).valueChanges().subscribe (res =>{
      console.log('datos ->', res)
      if (res){
        this.nombre = res.fullname
        this.cursos = res.asignaturas
      }
    })
  }
}
