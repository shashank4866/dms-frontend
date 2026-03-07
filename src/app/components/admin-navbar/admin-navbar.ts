import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin-navbar',
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './admin-navbar.html',
    styleUrl: './admin-navbar.css',
})
export class AdminNavbar {
    user: any = null;

    constructor(private auth: AuthService, private router: Router) {
        this.user = this.auth.getUser();
    }

    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}
