import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
    selector: 'app-product-detail',
    imports: [CommonModule, FormsModule, Navbar],
    templateUrl: './product-detail.html',
    styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
    product: any = null;
    loading = true;
    quantity = 1;
    user: any = null;
    toast = '';
    toastType = 'success';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private api: ApiService,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.user = this.auth.getUser();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.api.getProduct(+id).subscribe({
                next: (res: any) => { this.product = res.data; this.loading = false; },
                error: () => { this.loading = false; }
            });
        }
    }

    increaseQuantity() {
        if (this.product && this.quantity < this.product.stock) {
            this.quantity++;
        }
    }

    decreaseQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    addToCart() {
        let completed = 0;
        const total = this.quantity;
        const payload = {
            pid: this.product.id, name: this.product.name, price: this.product.price,
            category: this.product.category, image_url: this.product.image_url,
            stock: this.product.stock, user_id: this.user.id
        };

        for (let i = 0; i < total; i++) {
            this.api.addToCart(payload).subscribe({
                next: () => {
                    completed++;
                    if (completed === total) {
                        this.showToast(`Added ${total} item(s) to cart!`, 'success');
                    }
                },
                error: () => this.showToast('Failed to add to cart', 'error')
            });
        }
    }

    addToWishlist() {
        this.api.addToWishlist({
            pid: this.product.id, name: this.product.name, price: this.product.price,
            category: this.product.category, image_url: this.product.image_url,
            stock: this.product.stock, user_id: this.user.id
        }).subscribe({
            next: () => this.showToast('Added to wishlist!', 'success'),
            error: () => this.showToast('Failed', 'error')
        });
    }

    getStars(rating = 4.5): string {
        return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
    }

    showToast(msg: string, type: string) {
        this.toast = msg;
        this.toastType = type;
        setTimeout(() => this.toast = '', 3000);
    }

    goBack() { this.router.navigate(['/home']); }
}
