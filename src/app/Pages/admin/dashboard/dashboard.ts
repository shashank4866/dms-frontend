import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { AdminNavbar } from '../../../components/admin-navbar/admin-navbar';

@Component({
    selector: 'app-admin-dashboard',
    imports: [CommonModule, AdminNavbar],
    templateUrl: './dashboard.html',
    styleUrl: './dashboard.css',
})
export class AdminDashboard implements OnInit {
    products: any[] = [];
    orders: any[] = [];
    loading = true;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.api.getProducts().subscribe((res: any) => {
            this.products = res.data || [];
            this.checkLoaded();
        });
    }

    checkLoaded() { this.loading = false; }

    get totalRevenue(): number {
        return this.orders.reduce((sum, o) => sum + parseFloat(o.total_price || '0'), 0);
    }

    get lowStockProducts(): any[] {
        return this.products.filter(p => p.stock <= 5);
    }

    getStatusClass(status: string): string {
        const s = (status || 'placed').toLowerCase();
        if (s === 'delivered') return 'badge-success';
        if (s === 'shipped') return 'badge-info';
        if (s === 'packed') return 'badge-warning';
        return 'badge-primary';
    }
}
