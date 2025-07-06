import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Menubar } from '../menubar/menubar';
import { Table } from '../table/table';
import { Search } from '../search/search';

@Component({
  selector: 'app-menudashboard',
  imports: [Header, Menubar, Search, Table],
  templateUrl: './menudashboard.html',
  styleUrl: './menudashboard.scss'
})
export class Menudashboard {
  
}
