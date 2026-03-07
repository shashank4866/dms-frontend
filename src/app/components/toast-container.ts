import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="toast-wrapper">
    <div class="toast" *ngFor="let t of toastSvc.toasts$ | async">
      <div class="toast-header">
        <strong *ngIf="t.title">{{ t.title }}</strong>
        <button class="close-btn" (click)="toastSvc.remove(t.id)">✖</button>
      </div>
      <div class="toast-body">{{ t.message }}</div>
    </div>
  </div>
  `,
  styles: [
    `
    .toast-wrapper { position: fixed; top: 1rem; right: 1rem; display:flex; flex-direction:column; gap:0.5rem; z-index:10000; }
    .toast { background:#333; color:white; padding:0.75rem 1rem; border-radius:4px; min-width:220px; box-shadow:0 2px 6px rgba(0,0,0,0.3); }
    .toast-header { display:flex; justify-content:space-between; align-items:center; font-weight:600; margin-bottom:0.25rem; }
    .toast-body { font-size:0.95rem; }
    .close-btn { background:transparent; color:#fff; border:none; cursor:pointer; font-size:0.95rem; }
    `,
  ],
})
export class ToastContainer {
  constructor(public toastSvc: ToastService) {}
}
