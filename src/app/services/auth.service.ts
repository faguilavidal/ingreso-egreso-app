import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore/';
// import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore) { }

  initAuthListener(){
    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
      console.log(fuser?.uid);
      console.log(fuser?.email);
    });
  }

  crearUsuario(usuario: string, email: string , password: string){
    //console.log({usuario, email, password});
    return this.auth.createUserWithEmailAndPassword(email, password).then(
      ({ user }) => {
        const u = new Usuario(user?.uid, usuario, user?.email);
        return this.firestore.doc(`${ user?.uid}/usuario`).set( { ...u })
      }
    );
  }

  loginUsuario(email: string , password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null)
    );
  }
}
