import { Routes } from '@angular/router';
import { MenusDashboard } from './components/dashboards/menus-dashboard/menus-dashboard';
import { InventoryDashboard } from './components/dashboards/inventory-dashboard/inventory-dashboard';
import { LoginPage } from './components/login-page/login-page';
import { UserDashboard } from './components/dashboards/user-dashboard/user-dashboard';
import { CashDashboard } from './components/dashboards/cash-dashboard/cash-dashboard';
import { AdminGuard } from './guards/admin.guard';
import { MesasDashboard } from './components/dashboards/mesas-dashboard/mesas-dashboard';
import { Reports } from './components/dashboards/reports/reports';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'inventory', component: InventoryDashboard, canActivate: [AdminGuard] },
  { path: 'menus', component: MenusDashboard, canActivate: [AdminGuard] },
  { path: 'users', component: UserDashboard, canActivate: [AdminGuard] },
  { path: 'cash', component: CashDashboard, canActivate: [AdminGuard] },
  { path: 'mesas', component: MesasDashboard, canActivate: [AdminGuard] },
  { path: 'reportes', component: Reports, canActivate: [AdminGuard] }
];
