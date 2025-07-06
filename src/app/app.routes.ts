import { Routes } from '@angular/router';
import { Menudashboard } from './components/menudashboard/menudashboard';

export const routes: Routes = [
  {path: 'menudashboard', component: Menudashboard},
  {path: '', redirectTo: 'menudashboard', pathMatch: 'full'}
];
