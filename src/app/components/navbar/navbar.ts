import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
    user: any = null;
    cartCount = 0;
    wishlistCount = 0;
    showDropdown = false;
    searchQuery = '';

    constructor(
        private auth: AuthService,
        private api: ApiService,
        private router: Router
    ) { }

    ngOnInit() {
        this.user = this.auth.getUser();
        if (this.user) {
            this.api.getCart(this.user.id).subscribe((res: any) => {
                this.cartCount = res?.data?.length || 0;
            });
            this.api.getWishlist(this.user.id).subscribe((res: any) => {
                this.wishlistCount = res?.data?.length || 0;
            });
        }
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }

    search() {
        if (this.searchQuery.trim()) {
            this.router.navigate(['/home'], { queryParams: { q: this.searchQuery } });
        }
    }

    toggleDropdown() { this.showDropdown = !this.showDropdown; }
}
