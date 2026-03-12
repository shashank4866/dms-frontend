import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../../components/navbar/navbar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-orders',
    imports: [CommonModule, Navbar],
    templateUrl: './orders.html',
    styleUrl: './orders.css',
})
export class Orders implements OnInit, OnDestroy {
    orders: any[] = [];
    loading = true;
    user: any = null;
    expandedOrderId: number | null = null;
    private destroy$ = new Subject<void>();

    constructor(private api: ApiService, private auth: AuthService) { }

    ngOnInit() {
        this.user = this.auth.getUser();
        this.fetchOrders();

        // Listen for order updates from notifications
        this.api.orderUpdated$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.fetchOrders();
            });
    }

    fetchOrders() {
        this.api.getOrders(this.user.id).subscribe({
            next: (res: any) => { this.orders = res.data || []; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    toggleOrderDetails(orderId: number) {
        this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
    }

    getStatusClass(status: string): string {
        const s = (status || 'placed').toLowerCase();
        if (s === 'delivered') return 'badge-success';
        if (s === 'shipped') return 'badge-info';
        if (s === 'packed') return 'badge-warning';
        return 'badge-primary';
    }

    getStatusIcon(status: string): string {
        const s = (status || '').toLowerCase();
        if (s === 'delivered') return 'check_circle';
        if (s === 'shipped') return 'local_shipping';
        if (s === 'packed') return 'inventory_2';
        return 'shopping_bag';
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
