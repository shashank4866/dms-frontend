import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  title?: string;
  message: string;
  createdAt: number;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts: Toast[] = [];
  private $toasts = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.$toasts.asObservable();
  private nextId = 1;

  show(message: string, title?: string, duration = 5000) {
    const toast: Toast = {
      id: this.nextId++,
      title,
      message,
      createdAt: Date.now(),
      duration,
    };
    this.toasts.push(toast);
    this.$toasts.next(this.toasts.slice());

    if (duration > 0) {
      setTimeout(() => this.remove(toast.id), duration);
    }
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.$toasts.next(this.toasts.slice());
  }
}
