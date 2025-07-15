import {Component, Input, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatPaginatorModule, MatSortModule
  ],
  templateUrl: './table.html',
  styleUrl: './table.scss'
})
export class Table {
  @Input() columns: { field: string, header: string} [] = [];
  @Input() set dataSource(data: any[] | null) {
    this.dataSourceInstance.data = data ?? [];
  }
  dataSourceInstance = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  get displayedColumns(): string[] {
    return this.columns.map(col => col.field);
  }

  ngAfterViewInit() {
    this.dataSourceInstance.paginator = this.paginator;
    this.dataSourceInstance.sort = this.sort;
  }
}
