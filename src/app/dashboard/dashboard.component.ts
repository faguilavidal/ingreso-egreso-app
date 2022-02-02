import { Component, OnDestroy, OnInit } from '@angular/core';
import { props, Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import { setItems } from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription | any;
  ieSubs: Subscription | any;

  constructor(
    private store: Store<AppState>,
    private ieService: IngresoEgresoService
    ) { }

  ngOnInit(): void {

    this.userSubs = this.store.select('user')
    .pipe(
      filter(auth => auth.user != null)
    )
    .subscribe( ({ user }) => {
        this.ieSubs = this.ieService.initIngresosEgresosListener(user.uid)
        .subscribe( ie => {
          this.store.dispatch(setItems({ items: ie }));
        })
      }
    );

  }

  ngOnDestroy(): void {
    this.ieSubs?.unsubscribe();
    this.userSubs?.unsubscribe();
  }

}
