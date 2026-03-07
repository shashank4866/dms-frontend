/* Using RouterLink in template so need to import it */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
    selector: 'app-cart',
    imports: [CommonModule, Navbar, RouterLink],
    templateUrl: './cart.html',
    styleUrl: './cart.css',
})
export class Cart implements OnInit {
    cartItems: any[] = [];
    loading = true;
    user: any = null;
    toast = '';
    toastType = 'success';
    placingOrder = false;

    constructor(private api: ApiService, private auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.user = this.auth.getUser();
        this.loadCart();
    }

    loadCart() {
        this.loading = true;
        this.api.getCart(this.user.id).subscribe({
            next: (res: any) => { this.cartItems = res.data || []; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    removeItem(id: number) {
        this.api.removeFromCart(id).subscribe({
            next: () => { this.cartItems = this.cartItems.filter(i => i.id !== id); this.showToast('Removed from cart', 'success'); },
            error: () => this.showToast('Failed to remove', 'error')
        });
    }

    get subtotal(): number {
        return this.cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);
    }
    get shipping(): number { return this.subtotal > 100 ? 0 : 9.99; }
    get total(): number { return this.subtotal + this.shipping; }

    placeAllOrders() {
        if (!this.cartItems.length) return;
        this.placingOrder = true;
        let completed = 0;
        const total = this.cartItems.length;
        const itemsCopy = [...this.cartItems];
        itemsCopy.forEach(item => {
            this.api.placeOrder({
                user_id: this.user.id,
                user_name: this.user.name,
                product_id: item.pid,
                product_name: item.name,
                quantity: 1,
                total_price: item.price
            }).subscribe({
                next: () => {
                    this.api.removeFromCart(item.id).subscribe();
                    completed++;
                    if (completed === total) {
                        this.cartItems = [];
                        this.placingOrder = false;
                        this.showToast('Order placed successfully!', 'success');
                        setTimeout(() => this.router.navigate(['/orders']), 1500);
                    }
                },
                error: () => { this.placingOrder = false; this.showToast('Failed to place order', 'error'); }
            });
        });
    }

    showToast(msg: string, type: string) {
        this.toast = msg; this.toastType = type;
        setTimeout(() => this.toast = '', 3000);
    }
}
