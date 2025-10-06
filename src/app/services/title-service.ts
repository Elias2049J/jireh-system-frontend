import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  // Título principal (puede establecerse manualmente con setTitle)
  private mainTitleSubject = new BehaviorSubject<string>('Administracion');
  mainTitle$ = this.mainTitleSubject.asObservable();

  // Breadcrumb generado automáticamente a partir de la ruta
  private breadcrumbSubject = new BehaviorSubject<string>('');
  breadcrumb$ = this.breadcrumbSubject.asObservable();

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((ev): ev is NavigationEnd => ev instanceof NavigationEnd)
    ).subscribe((navEnd) => {
      const url = navEnd.urlAfterRedirects || navEnd.url;
      const crumb = this.buildBreadcrumbFromUrl(url);
      this.breadcrumbSubject.next(crumb.length ? crumb : '');
    });
  }

  setTitle(title: string) {
    this.mainTitleSubject.next(title);
  }

  private buildBreadcrumbFromUrl(url: string): string {
    if (!url) return '';
    const path = url.split('?')[0].split('#')[0];
    const segments = path.split('/').filter(Boolean);
    if (segments.length === 0) return '';
    return segments.map(s => this.formatSegment(s)).join(' > ');
  }

  private formatSegment(seg: string): string {
    try {
      const decoded = decodeURIComponent(seg);
      return decoded.replace(/[-_]/g, ' ');
    } catch (e) {
      return seg.replace(/[-_]/g, ' ');
    }
  }
}
