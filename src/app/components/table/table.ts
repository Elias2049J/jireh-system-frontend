import { Component } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table {
  products: any[] = [];
  sortField: string = '';
  sortAsc: boolean = true;

  orderBy(field: string) {
    if (this.sortField === field) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortField = field;
      this.sortAsc = true;
    }
    this.products.sort((a, b) => {
      if (a[field] < b[field]) return this.sortAsc ? -1 : 1;
      if (a[field] > b[field]) return this.sortAsc ? 1 : -1;
      return 0;
    })
  }
}
