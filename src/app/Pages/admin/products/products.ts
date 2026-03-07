import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AdminNavbar } from '../../../components/admin-navbar/admin-navbar';

@Component({
    selector: 'app-admin-products',
    imports: [CommonModule, FormsModule, AdminNavbar],
    templateUrl: './products.html',
    styleUrl: './products.css',
})
export class AdminProducts implements OnInit {
    products: any[] = [];
    loading = true;
    showForm = false;
    toast = '';
    toastType = 'success';
    submitting = false;

    newProduct = { name: '', description: '', price: 0, stock: 0, category: '', image_url: '' };
    categories = ['Audio', 'Wearables', 'Computers', 'Photography', 'Mobile', 'Accessories'];

    constructor(private api: ApiService) { }

    ngOnInit() { 
        this.loadProducts(); 
    
    }

    loadProducts() {
        this.loading = true;
        this.api.getProducts().subscribe({
            next: (res: any) => {
                 this.products = res.data || [];
                     console.log(this.products);

                  this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.newProduct.image_url = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    addProduct() {
        if (!this.newProduct.name || !this.newProduct.price || !this.newProduct.category) {
            this.showToast('Please fill in required fields', 'error'); return;
        }
        this.submitting = true;
        this.api.addProduct(this.newProduct).subscribe({
            next: () => {
                this.submitting = false;
                this.showForm = false;
                this.newProduct = { name: '', description: '', price: 0, stock: 0, category: '', image_url: '' };
                this.loadProducts();
                this.showToast('Product added!', 'success');
            },
            error: () => { this.submitting = false; this.showToast('Failed to add product', 'error'); }
        });
    }

    showToast(msg: string, type: string) {
        this.toast = msg; this.toastType = type;
        setTimeout(() => this.toast = '', 3000);
    }
}
