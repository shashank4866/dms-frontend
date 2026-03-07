import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationCenterComponent } from '../notification-center/notification-center';

@Component({
    selector: 'app-admin-navbar',
    imports: [CommonModule, RouterLink, RouterLinkActive, NotificationCenterComponent],
    templateUrl: './admin-navbar.html',
    styleUrl: './admin-navbar.css',
})
export class AdminNavbar implements OnInit {
    user: any = null;
    showProfileDropdown = false;
    showMobileMenu = false;

    constructor(private auth: AuthService, private router: Router) {}

    ngOnInit() {
        this.user = this.auth.getUser();
    }

    logout() {
        this.showProfileDropdown = false;
        this.auth.logout();
        this.router.navigate(['/login']);
    }

    toggleProfileDropdown() {
        this.showProfileDropdown = !this.showProfileDropdown;
    }

    toggleMobileMenu() {
        this.showMobileMenu = !this.showMobileMenu;
    }

    closeMobileMenu() {
        this.showMobileMenu = false;
    }

    // Close profile dropdown when clicking anywhere outside the user menu
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.admin-user-menu')) {
            this.showProfileDropdown = false;
        }
    }
}
