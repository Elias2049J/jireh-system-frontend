import { Routes } from '@angular/router';
import { ProductsDashboard } from './components/products-dashboard/products-dashboard';
import {MenusDashboard} from './components/menus-dashboard/menus-dashboard';
import {LoginForm} from './components/login/login-form';

export const routes: Routes = [
  {path: '', redirectTo: 'menus', pathMatch: 'full'},
  {path: 'menu/:idMenu/products', component: ProductsDashboard},
  {path: 'login', component: LoginForm},
  {path: 'menus', component: MenusDashboard}
];
