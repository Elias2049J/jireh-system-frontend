import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {TitleService} from '../../services/title-service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  constructor(private titleService: TitleService) {
  }

  //sets the title of the Header component as the string arg required
  setTitle(title:string) {
    this.titleService.setTitle(title);
  }
}
