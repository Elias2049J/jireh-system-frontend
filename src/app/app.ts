import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './components/sidebar/sidebar';
import { Menudashboard } from "./components/menudashboard/menudashboard";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Menudashboard],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'pos';
}
