import { Action, createReducer, on } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { setItems, unSetItems } from './ingreso-egreso.actions';
import { AppState } from '../app.reducer';

export interface State {
    items: IngresoEgreso[]; 
}

export interface AppStateWithIngreso extends AppState{
    ingresoEgreso: State
}

export const initialState: State = {
    items: [],
}

const _ingresoEgresoReducer = createReducer(initialState,

    on(setItems, (state, { items }) => ({ ...state, items: [...items]})),
    on(unSetItems, state => ({ ...state, items: []})),

);

export function ingresoEgresoReducer(state: any, action: Action) {
    return _ingresoEgresoReducer(state, action);
}