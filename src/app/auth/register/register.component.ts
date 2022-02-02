import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { isLoading, stopLoading } from '../../shared/ui.action';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup | any;
  cargando: boolean = false;
  uiSubs: Subscription | any;

  constructor( 
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private store: Store<AppState>) { }
  
  ngOnInit(): void {

    this.registroForm = this.fb.group({
      usuario: ['',Validators.required],
      correo: ['',[Validators.required, Validators.email]],
      password: ['',Validators.required]
    });

    this.uiSubs =this.store.select('ui').subscribe( ui => {
      this.cargando = ui.isLoading;
    });

  }

  ngOnDestroy() {
    this.uiSubs.unsubscribe();
  }

  crearUsuario() {
    if (this.registroForm.invalid) {return;}

    this.store.dispatch(isLoading());

    const {usuario, correo, password} = this.registroForm.value;

    this.authService.crearUsuario(usuario, correo, password).then(credenciales => {
      console.log(credenciales);
      // Swal.close();
      this.store.dispatch(stopLoading());
      this.router.navigate(['/login']);
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
