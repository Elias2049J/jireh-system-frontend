import { Component } from '@angular/core';
import { TitleService } from '../../services/title-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  mainTitle$;
  breadcrumb$;
  constructor(private titleService: TitleService) {
    this.mainTitle$ = this.titleService.mainTitle$;
    this.breadcrumb$ = this.titleService.breadcrumb$;
   }
}
