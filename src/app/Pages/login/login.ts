import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FcmService } from '../../services/fcm';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;
  fcmToken='';
  user_id:any;


  constructor(private api: ApiService, private auth: AuthService, private router: Router,private fcmService:FcmService) {
    if (this.auth.isLoggedIn()) {
      this.router.navigate([this.auth.isAdmin() ? '/admin' : '/home']);
    }
  }

  login() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.api.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.data && res.data.length > 0) {
          const user = res.data[0];
          this.auth.setUser(user);
          this.user_id = user.id;
          localStorage.setItem('user_id', this.user_id);
          this.fcmToken=localStorage.getItem('fcmToken') || '';
          this.fcmService.sendTokenToBackend(this.fcmToken,this.user_id).subscribe({
            next: () => { console.log('FCM token saved'); },
            error: () => { console.log('Failed to save FCM token'); }
          });


          // Get FCM token and save to backend
          this.router.navigate([user.role === 'admin' ? '/admin' : '/home']);
        } else {
          this.error = 'Invalid email or password.';
        }
      },
      error: () => {
        this.loading = false;
        this.error = 'Server error. Make sure the backend is running.';
      }
    });
  }
}
