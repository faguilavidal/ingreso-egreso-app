import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { isLoading, stopLoading } from '../shared/ui.action';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy{

  ieForm: FormGroup | any;
  tipo: string = "I";
  cargando: boolean = false;
  loadingSubs: Subscription | any;

  constructor(
    private fb: FormBuilder,
    private ieService: IngresoEgresoService,
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {

    this.loadingSubs = this.store.select('ui')
    .subscribe( ui => this.cargando = ui.isLoading );
    // this.store.select('ui').subscribe( {isLoading} => this.cargando = isLoading ); Otra Opción

    this.ieForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });

  }

  ngOnDestroy() {
      this.loadingSubs.unsubscribe();
  }

  guardar(){

    if(this.ieForm.invalid) {return;}

    this.store.dispatch(isLoading());

    const { descripcion, monto } = this.ieForm.value;

    const ie = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ieService.crearIngresoEgreso(ie)
    .then( () => {
      this.ieForm.reset();
      this.store.dispatch(stopLoading());
      Swal.fire('Registro Creado', descripcion, 'success');
    }).catch(err => {
      this.store.dispatch(stopLoading());
      Swal.fire('Error', err.message, 'error');
    });

  }
}
