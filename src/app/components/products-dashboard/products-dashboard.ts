import { Component, OnInit } from '@angular/core';
import { TitleService } from '../../services/title-service';
import { Menubar } from '../menubar/menubar';
import { Table } from '../table/table';
import { Search } from '../search/search';

@Component({
  selector: 'app-menudashboard',
  imports: [Menubar, Search, Table],
  templateUrl: './menudashboard.html',
  styleUrl: './menudashboard.scss'
})
export class Menudashboard implements OnInit {
  constructor(private titleService: TitleService) {}

  ngOnInit(){
    this.titleService.setTitle('Administracion de Platos a la Carta')
  }
}
