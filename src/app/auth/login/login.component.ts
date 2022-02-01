import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { AppState } from '../../app.reducer';
import { isLoading, stopLoading } from '../../shared/ui.action';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy{

  loginForm: FormGroup | any;
  cargando: boolean = false;
  uiSubs: Subscription | any;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private store: Store<AppState>) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      correo: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(4)]]
    });

    this.uiSubs =this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
      // console.log('Cargando subs');
    });
  }

  ngOnDestroy() {
    this.uiSubs.unsubscribe();
  }

  loginUsuario() {
    if (this.loginForm.invalid) {return;}

    this.store.dispatch(isLoading());

    // Swal.fire({
    //   title: 'Autenticando usuario',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // })

    const {correo, password} = this.loginForm.value;

    this.authService.loginUsuario(correo, password).then(credenciales => {
      // Swal.close();
      this.store.dispatch(stopLoading())
      this.router.navigate(['/']);
    }).catch(err => {
        this.store.dispatch(stopLoading());
        Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    });

  }

}
