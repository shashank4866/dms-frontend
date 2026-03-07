import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
    selector: 'app-wishlist',
    imports: [CommonModule, Navbar, RouterLink],
    templateUrl: './wishlist.html',
    styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
    wishlistItems: any[] = [];
    loading = true;
    user: any = null;
    toast = '';
    toastType = 'success';

    constructor(private api: ApiService, private auth: AuthService) { }

    ngOnInit() {
        this.user = this.auth.getUser();
        this.loadWishlist();
    }

    loadWishlist() {
        this.loading = true;
        this.api.getWishlist(this.user.id).subscribe({
            next: (res: any) => { this.wishlistItems = res.data || []; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    removeFromWishlist(id: number) {
        this.api.removeFromWishlist(id).subscribe({
            next: () => { this.wishlistItems = this.wishlistItems.filter(i => i.id !== id); this.showToast('Removed', 'success'); },
            error: () => this.showToast('Failed', 'error')
        });
    }

    moveToCart(item: any) {
        this.api.addToCart({
            pid: item.pid, name: item.name, price: item.price,
            category: item.category, image_url: item.image_url,
            stock: item.stock, user_id: this.user.id
        }).subscribe({
            next: () => { this.removeFromWishlist(item.id); this.showToast('Moved to cart!', 'success'); },
            error: () => this.showToast('Failed', 'error')
        });
    }

    showToast(msg: string, type: string) {
        this.toast = msg; this.toastType = type;
        setTimeout(() => this.toast = '', 3000);
    }
}
