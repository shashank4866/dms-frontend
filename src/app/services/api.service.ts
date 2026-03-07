import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// local
// const BASE = 'http://localhost:3001';
// prod
const BASE = 'https://dms-backend-pm4s.onrender.com';
@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) { }

  // Auth
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${BASE}/login`, { email, password });
  }
  register(data: any): Observable<any> {
    return this.http.post(`${BASE}/userRegestration`, data);
  }

  // Products
  getProducts(): Observable<any> {
    return this.http.get(`${BASE}/getProducts`);
  }
  getProduct(id: number): Observable<any> {
    return this.http.get(`${BASE}/getProduct/${id}`);
  }
  addProduct(data: any): Observable<any> {
    return this.http.post(`${BASE}/addProduct`, data);
  }

  // Cart
  getCart(userId: number): Observable<any> {
    return this.http.get(`${BASE}/getCart/${userId}`);
  }
  addToCart(data: any): Observable<any> {
    return this.http.post(`${BASE}/addToCart`, data);
  }
  removeFromCart(id: number): Observable<any> {
    return this.http.delete(`${BASE}/removeFromCart/${id}`);
  }

  // Wishlist
  getWishlist(userId: number): Observable<any> {
    return this.http.get(`${BASE}/getWishlist/${userId}`);
  }
  addToWishlist(data: any): Observable<any> {
    return this.http.post(`${BASE}/addToWishlist`, data);
  }
  removeFromWishlist(id: number): Observable<any> {
    return this.http.delete(`${BASE}/removeFromWishlist/${id}`);
  }

  // Orders
  placeOrder(data: any): Observable<any> {
    return this.http.post(`${BASE}/placeOrder`, data);
  }
  getOrders(userId: number): Observable<any> {
    return this.http.get(`${BASE}/getOrders/${userId}`);
  }
  updateOrderStatus(data: any): Observable<any> {
    return this.http.patch(`${BASE}/updateOrderStatus`, data);
  }
  updateOrder(data: any): Observable<any> {
    return this.http.patch(`${BASE}/updateOrder`, data);
  }

  // Admin
  getUsers(): Observable<any> {
    return this.http.get(`${BASE}/getUsers`);
  }
  getAllOrders(): Observable<any> {
    return this.http.get(`${BASE}/getAllOrders`);
  }
}
