import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Sidebar } from './components/sidebar/sidebar';
import { Header } from './components/header/header';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    Header,
    CommonModule
  ],
  templateUrl: './app.html'
})
export class App implements OnInit {
  title = 'Sistema Jireh';
  isLoginPage = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.isLoginPage = this.router.url === '/login' || this.router.url === '/';

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isLoginPage = event.url === '/login' || event.url === '/';
    });
  }
}
