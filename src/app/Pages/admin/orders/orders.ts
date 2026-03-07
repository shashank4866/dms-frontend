import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AdminNavbar } from '../../../components/admin-navbar/admin-navbar';

@Component({
    selector: 'app-admin-orders',
    imports: [CommonModule, FormsModule, AdminNavbar],
    templateUrl: './orders.html',
    styleUrl: './orders.css',
})
export class AdminOrders implements OnInit {
    orders: any[] = [];
    loading = true;
    toast = '';
    toastType = 'success';
    statuses = ['placed', 'packed', 'shipped', 'delivered'];

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.loading = true;
        this.api.getAllOrders().subscribe({
            next: (res: any) => {
                this.orders = res.data || [];
                this.loading = false;
            },
            error: () => {
                this.loading = false;
                this.showToast('Failed to load orders', 'error');
            }
        });
    }

    updateStatus(order: any, newStatus: string) {
        this.api.updateOrderStatus({
            id: order.id,
            user_id: order.user_id,
            order_status: newStatus
        }).subscribe({
            next: () => {
                order.order_status = newStatus;
                this.showToast('Status updated successfully!', 'success');
            },
            error: () => this.showToast('Failed to update status', 'error')
        });
    }

    getStatusClass(status: string): string {
        const s = (status || 'placed').toLowerCase();
        if (s === 'delivered') return 'badge-success';
        if (s === 'shipped') return 'badge-info';
        if (s === 'packed') return 'badge-warning';
        return 'badge-primary';
    }

    showToast(msg: string, type: string) {
        this.toast = msg;
        this.toastType = type;
        setTimeout(() => this.toast = '', 3000);
    }
}
