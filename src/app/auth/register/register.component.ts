import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup | any;

  constructor( private fb: FormBuilder, private authService: AuthService, private router: Router) { }
  
  ngOnInit(): void {

    this.registroForm = this.fb.group({
      usuario: ['',Validators.required],
      correo: ['',[Validators.required, Validators.email]],
      password: ['',Validators.required]
    });

  }

  crearUsuario() {
    if (this.registroForm.invalid) {return;}

    Swal.fire({
      title: 'Registrando usuario',
      didOpen: () => {
        Swal.showLoading()
      }
    })

    const {usuario, correo, password} = this.registroForm.value;

    this.authService.crearUsuario(usuario, correo, password).then(credenciales => {
      console.log(credenciales);
      Swal.close();
      this.router.navigate(['/login']);
    }).catch(err => Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: err.message,
    }));
  }

}
