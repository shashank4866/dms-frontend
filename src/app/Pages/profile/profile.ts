import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { Navbar } from '../../components/navbar/navbar';

@Component({
    selector: 'app-profile',
    imports: [CommonModule, Navbar, FormsModule],
    templateUrl: './profile.html',
    styleUrl: './profile.css',
})
export class Profile implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef;

    user: any = null;
    isEditing = false;
    selectedFile: File | null = null;
    previewUrl: string | null = null;
    isLoading = false;

    constructor(
        private auth: AuthService,
        private api: ApiService,
        private toast: ToastService
    ) { }

    ngOnInit() {
        this.user = this.auth.getUser();
    }

    getInitials(): string {
        return (this.user?.name || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
    }

    toggleEditMode(): void {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            this.selectedFile = null;
            this.previewUrl = null;
        }
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.toast.show('File size must be less than 5MB', 'Error', 5000);
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.toast.show('Please select an image file', 'Error', 5000);
                return;
            }

            this.selectedFile = file;

            // Create preview
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.previewUrl = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    triggerFileInput(): void {
        this.fileInput.nativeElement.click();
    }

    updateProfile(): void {
        if (!this.selectedFile) {
            this.toast.show('Please select a profile picture', 'Error', 5000);
            return;
        }

        this.isLoading = true;
        const formData = new FormData();
        formData.append('profilePic', this.selectedFile);

        this.api.updateProfile({ id: this.user.id, user_img: this.previewUrl }).subscribe({
            next: (res: any) => {
                if (res.success || res.status === 200) {
                    // Update user data
                    const updatedUser = { ...this.user, user_img: res.data?.user_img || this.user.user_img };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    this.user = updatedUser;
                    this.toast.show('Profile updated successfully', 'Success', 5000);
                    this.isEditing = false;
                    this.selectedFile = null;
                    this.previewUrl = null;
                } else {
                    this.toast.show('Failed to update profile', 'Error', 5000);
                }
                this.isLoading = false;
            },
            error: (err: any) => {
                console.error('Error updating profile:', err);
                this.toast.show(err.error?.message || 'Error updating profile', 'Error', 5000);
                this.isLoading = false;
            }
        });
    }

    cancelEdit(): void {
        this.isEditing = false;
        this.selectedFile = null;
        this.previewUrl = null;
    }
}
