import {Component, OnInit} from '@angular/core';
import {MenuService} from '../../services/menu-service';
import {MenuForm} from '../forms/menu-form/menu-form';
import {CommonModule} from '@angular/common';
import {Menu} from '../../models/menu.model';
import {RouterLink} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-menus-dashboard',
  imports: [MenuForm, CommonModule, RouterLink],
  templateUrl: './menus-dashboard.html',
  styleUrl: './menus-dashboard.scss'
})
export class MenusDashboard implements OnInit {
  private _menus = new BehaviorSubject<Menu[]>([]);
  menus$ = this._menus.asObservable();
  showForm: boolean = false;

  constructor(
    private menuService: MenuService,
  ) {}

  ngOnInit(){
    this.loadMenus();
  }

  //loads the menus from the api using the getAll method from service
  loadMenus(): void{
    this.menuService.getAll().subscribe({
      next: (data) => {
        this._menus.next(data);
        console.log('Received menus:', data);
      },
      error: (err) => {
        console.log('Error loading menus', err);
      }
    });
  }

  // code that executes at the moment you push the button "accept"
  onNameEntered(name: string) {
    this.showForm = false;
    const newMenu = {idMenu: null as any, name: name.toLowerCase(), products: [] };
    this.menuService.create(newMenu).subscribe({
      next: (createdMenu) => {
        console.info('New menu created successfully:', createdMenu);
        this.loadMenus();
      },
      error: (err) => {
        console.error(`Error creating menu: ${newMenu.name} in menusDashboard`, err);
      }
    });
  }
}
