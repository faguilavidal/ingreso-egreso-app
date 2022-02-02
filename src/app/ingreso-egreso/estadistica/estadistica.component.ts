import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from 'src/app/models/ingreso-egreso.model';

import { ChartData, ChartType } from 'chart.js';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ieSubs: Subscription | any;

  ingresos: number = 0;
  egresos: number = 0;
  totalIngresos: number = 0;
  totalEgresos: number = 0;

  // Doughnut
  public doughnutChartLabels: string[] = [ 'Ingresos', 'Egresos',];
  public doughnutChartData: ChartData = {
    labels: this.doughnutChartLabels,
    datasets: [ 
      { data: [ ] },]
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private store: Store<AppStateWithIngreso>) {}

  ngOnInit(): void {
    this.ieSubs = this.store.select('ingresoEgreso').subscribe( ({items}) => this.generarEstadistica( items ));
  }

  ngOnDestroy(): void {
    this.ieSubs?.unsubscribe();
  }

  generarEstadistica(items: IngresoEgreso[]) {

    this.ingresos = 0;
    this.egresos = 0;
    this.totalIngresos = 0;
    this.totalEgresos = 0;
    
    for (const item of items) {
      if (item.tipo === 'I') {
        this.totalIngresos += item.monto;
        this.ingresos ++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos ++;
      }
    }
    
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [ 
        { data: [this.totalIngresos, this.totalEgresos ] },]
    };
  }

}
