import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/compat/firestore/';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { setUser, unSetuser } from '../auth/auth.actions';
import { Subscription } from 'rxjs';
// import 'firebase/firestore';
import { unSetItems } from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubs: Subscription | any;
  private _user: Usuario | any;

  get user() {
    return this._user;
  }

  constructor(
    public auth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private store: Store<AppState>) { }

  initAuthListener(){
    this.auth.authState.subscribe( fuser => {
      if (fuser) {
      // existe
      this.userSubs = this.firestore.doc(`${ fuser?.uid}/usuario`).valueChanges().subscribe( (firestoreUser: any) => {
        // console.log({firestoreUser});
        const user = Usuario.fromFirebase( firestoreUser);
        this._user = user;
        this.store.dispatch(setUser({ user }));
      });

      } else {
        // no existe
        this._user = null;
        this.userSubs.unsubscribe();
        this.store.dispatch(unSetuser());
        this.store.dispatch(unSetItems());
      }

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
