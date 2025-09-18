import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {TitleService} from '../../services/title-service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  constructor(
    private titleService: TitleService,
    private authService: AuthService,
    private router: Router
  ) {
  }

  //sets the title of the Header component as the string arg required
  setTitle(title:string) {
    this.titleService.setTitle(title);
  }

  logout() {
    this.authService.logout();
  }
}
