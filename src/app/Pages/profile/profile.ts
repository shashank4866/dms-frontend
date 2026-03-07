import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, Navbar],
    templateUrl: './profile.html',
    styleUrl: './profile.css',
})
export class Profile implements OnInit {
    user: any = null;

    constructor(private auth: AuthService) { }

    ngOnInit() {
        this.user = this.auth.getUser();
    }

    getInitials(): string {
        return (this.user?.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
    }
}
