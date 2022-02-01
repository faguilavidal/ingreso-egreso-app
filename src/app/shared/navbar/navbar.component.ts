import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {

  userSubs: Subscription | any;
  email: string = "";

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
    .pipe(
      filter( ({user}) => user != null )
    )
    .subscribe( ({user}) => this.email = user.email)
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

}
