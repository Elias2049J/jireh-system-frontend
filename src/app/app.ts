import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { ProductsDashboard } from "./components/dashboards/products-dashboard/products-dashboard";
import { Header } from './components/header/header';
import {MenusDashboard} from './components/dashboards/menus-dashboard/menus-dashboard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'pos';
}
