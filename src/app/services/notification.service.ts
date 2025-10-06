import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  autohide?: boolean;
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private nextId = 0;

  constructor() {
    console.log('NotificationService inicializado');
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  // Mostrar una notificación toast
  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', autohide = true, delay = 3000): number {
    const id = this.nextId++;
    const notification: Notification = { id, message, type, autohide, delay };

    console.log(`Mostrando notificación: ${type} - ${message}`);

    const current = this.notifications.value;
    this.notifications.next([...current, notification]);

    if (autohide) {
      setTimeout(() => this.remove(id), delay);
    }

    return id;
  }

  // Eliminar una notificación por ID
  remove(id: number): void {
    const current = this.notifications.value;
    this.notifications.next(current.filter(n => n.id !== id));
  }

  // Métodos de conveniencia
  success(message: string, autohide = true, delay = 3000): number {
    return this.show(message, 'success', autohide, delay);
  }

  error(message: string, autohide = true, delay = 3000): number {
    return this.show(message, 'error', autohide, delay);
  }

  info(message: string, autohide = true, delay = 3000): number {
    return this.show(message, 'info', autohide, delay);
  }

  warning(message: string, autohide = true, delay = 3000): number {
    return this.show(message, 'warning', autohide, delay);
  }
}
