import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../../components/navbar/navbar';
import { FcmService } from '../../services/fcm';

@Component({
    selector: 'app-home',
    imports: [CommonModule, FormsModule, Navbar],
    templateUrl: './home.html',
    styleUrl: './home.css',
})
export class Home implements OnInit {
    products: any[] = [];
    filteredProducts: any[] = [];
    loading = true;
    user: any = null;
    toast = '';
    toastType = 'success';
    user_id:any;
    fcmToken='';
    isMobileFiltersOpen = false;

    categories = ['All Products', 'Audio', 'Wearables', 'Computers', 'Photography', 'Mobile'];
    selectedCategory = 'All Products';
    maxPrice = 2000;
    sortBy = 'default';
    searchQuery = '';

    constructor(
        private api: ApiService,
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private fcmService:FcmService
    ) { }

    ngOnInit() {
      this.user_id=localStorage.getItem('user_id') || 0;
      this.fcmToken=localStorage.getItem('fcmToken') || '';

      // this.fcmService.sendTokenToBackend(this.fcmToken,this.user_id)
        this.user = this.auth.getUser();
        this.route.queryParams.subscribe(params => {
            this.searchQuery = params['q'] || '';
            this.loadProducts();
        });
    }

    loadProducts() {
        this.loading = true;
        this.api.getProducts().subscribe({
            next: (res: any) => {
                this.products = res.data || [];
                this.applyFilters();
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    applyFilters() {
        let result = [...this.products];
        if (this.selectedCategory !== 'All Products') {
            result = result.filter(p => p.category?.toLowerCase() === this.selectedCategory.toLowerCase());
        }
        if (this.searchQuery) {
            const q = this.searchQuery.toLowerCase();
            result = result.filter(p => p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
        }
        result = result.filter(p => parseFloat(p.price) <= this.maxPrice);

        if (this.sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
        else if (this.sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
        else if (this.sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));

        this.filteredProducts = result;
    }

    selectCategory(cat: string) {
        this.selectedCategory = cat;
        this.applyFilters();
        if (window.innerWidth <= 768) {
            this.isMobileFiltersOpen = false;
        }
    }

    toggleMobileFilters() {
        this.isMobileFiltersOpen = !this.isMobileFiltersOpen;
    }

    getStars(rating: number = 4): string {
        return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
    }

    goToProduct(id: number) {
        this.router.navigate(['/product', id]);
    }

    addToCart(event: Event, product: any) {
        event.stopPropagation();
        this.api.addToCart({
            pid: product.id, name: product.name, price: product.price,
            category: product.category, image_url: product.image_url,
            stock: product.stock, user_id: this.user.id
        }).subscribe({
            next: () => this.showToast('Added to cart!', 'success'),
            error: () => this.showToast('Failed to add to cart', 'error')
        });
    }

    addToWishlist(event: Event, product: any) {
        event.stopPropagation();
        this.api.addToWishlist({
            pid: product.id, name: product.name, price: product.price,
            category: product.category, image_url: product.image_url,
            stock: product.stock, user_id: this.user.id
        }).subscribe({
            next: () => this.showToast('Added to wishlist!', 'success'),
            error: () => this.showToast('Failed to add to wishlist', 'error')
        });
    }

    showToast(msg: string, type: string) {
        this.toast = msg;
        this.toastType = type;
        setTimeout(() => this.toast = '', 3000);
    }

    getImageFallback(url: string): string {
        return url || 'https://via.placeholder.com/300x200?text=Product';
    }
}
