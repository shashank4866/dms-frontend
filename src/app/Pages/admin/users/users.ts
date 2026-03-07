import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { AdminNavbar } from '../../../components/admin-navbar/admin-navbar';

@Component({
    selector: 'app-admin-users',
    imports: [CommonModule, AdminNavbar],
    templateUrl: './users.html',
    styleUrl: './users.css',
})
export class AdminUsers implements OnInit {
    users: any[] = [];
    loading = true;

    constructor(private api: ApiService) { }

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.loading = true;
        this.api.getUsers().subscribe({
            next: (res: any) => {
                this.users = res.data || [];
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    getInitials(name: string): string {
        return (name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
}
