import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { UsuarioI } from './models/models';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private ngFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore
  ) {}

  // Autentificando el usuario con AuthenticationService y enviando demás información con el UID
  // a una base de datos del mismo Usuario ( no directamente vinculado ) información extra


  registrarUser(datos : UsuarioI){
    return this.ngFireAuth.createUserWithEmailAndPassword(datos.email, datos.password)
  }

  //Login
  async loginUser(email: string, password: string) {
    return await this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

//Estado
  stateUser(){
    return this.ngFireAuth.authState
  }


  async resetPass(email: string) {
    return await this.ngFireAuth.sendPasswordResetEmail(email);
  }
  
//vale caca

  async registerUser(fullname: string, email: string, password: string, cuenta: string) {
    try {
      const userCredential = await this.ngFireAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      const userId = userCredential.user.uid;

      await this.angularFirestore.collection('usuarios').doc(userId).set({
        fullname,
        email,
        cuenta,
        // Agrega más campos aquí si es necesario
      });

      return userCredential.user;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  }

  // Cerrar Sesión
  async signOut() {
    return await this.ngFireAuth.signOut();
  }

  async updateUserProfile(uid: string, data: any) {
    try {
      // Actualizar el documento del usuario en la colección 'usuarios'
      await this.angularFirestore.collection('usuarios').doc(uid).update(data);
    } catch (error) {
      console.error('Error al actualizar el perfil del usuario:', error);
      throw error;
    }
  }

  // Muestra el console log del inicio con el UID y el DAT general
  
  getProfile(): Observable<{ uid: string; data: any } | null> {
    return from(this.ngFireAuth.currentUser).pipe(
      switchMap((user) => {
        if (user) {
          const uid = user.uid;
          return this.getUserData(uid).pipe(
            map((userData) => ({ uid, data: userData }))
          );
        } else {
          return of(null);
        }
      })
    );
  }

  getUserData(uid: string): Observable<any> {
    return from(this.angularFirestore.collection('usuarios').doc(uid).get()).pipe(
      switchMap((userDoc) => {
        if (userDoc.exists) {
          return of(userDoc.data());
        } else {
          console.error('No encontramos tu Usuario.');
          return of(null);
        }
      })
    );
  }

  async getUid(){
    const user = await this.ngFireAuth.currentUser;
    if (user){
      return user.uid
    }
    else {
      return null
    }

  }

  getCurrentUser() {
    return this.ngFireAuth.authState;
  }
  

  
  
}
