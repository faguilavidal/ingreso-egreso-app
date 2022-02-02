import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy{

  ieSubs: Subscription | any;

  ingresosEgresos: IngresoEgreso[] = [];

  constructor(private store: Store<AppStateWithIngreso>, private ieService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ieSubs = this.store.select('ingresoEgreso').subscribe(({items}) => this.ingresosEgresos = items);
  }
  
  ngOnDestroy(){
      this.ieSubs?.unsubscribe();
  }

  borrar(uid:string, desc:string){
    this.ieService.borrarIngresoEgreso(uid)
    .then( () => Swal.fire('Borrado', `Item ${ desc} borrado` , 'success'))
    .catch(err => Swal.fire('Error', err.message , 'error'));
  }

}
