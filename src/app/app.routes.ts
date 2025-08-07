import { Routes } from '@angular/router';
import { ProductsDashboard } from './components/dashboards/products-dashboard/products-dashboard';
import {MenusDashboard} from './components/dashboards/menus-dashboard/menus-dashboard';
import {LoginForm} from './components/login/login-form';
import {SaleDashboard} from './components/dashboards/sale-dashboard/sale-dashboard';
import {InventoryDashboard} from './components/dashboards/inventory-dashboard/inventory-dashboard';

export const routes: Routes = [
  {path: '', redirectTo: 'sales', pathMatch: 'full'},
  {path: 'menu/:idMenu/products', component: ProductsDashboard},
  {path: 'inventory', component: InventoryDashboard},
  {path: 'menus', component: MenusDashboard},
  {path: 'sales', component: SaleDashboard}
];
