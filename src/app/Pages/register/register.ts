import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
    selector: 'app-register',
    imports: [FormsModule, CommonModule, RouterLink],
    templateUrl: './register.html',
    styleUrl: './register.css',
})
export class Register {
    name = '';
    email = '';
    password = '';
    phone = '';
    loading = false;
    error = '';
    success = '';
    showPassword = false;

    constructor(private api: ApiService, private router: Router) { }

    register() {
        if (!this.name || !this.email || !this.password || !this.phone) {
            this.error = 'Please fill in all fields.';
            return;
        }
        this.loading = true;
        this.error = '';
        this.api.register({
            name: this.name,
            email: this.email,
            password: this.password,
            phone: this.phone,
            user_img: ''
        }).subscribe({
            next: () => {
                this.loading = false;
                this.success = 'Account created! Redirecting to login...';
                setTimeout(() => this.router.navigate(['/login']), 1500);
            },
            error: () => {
                this.loading = false;
                this.error = 'Server error. Make sure the backend is running.';
            }
        });
    }
}
