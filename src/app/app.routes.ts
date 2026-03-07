import { Routes } from '@angular/router';
import { Login } from './Pages/login/login';
import { Register } from './Pages/register/register';
import { Home } from './Pages/home/home';
import { ProductDetail } from './Pages/product-detail/product-detail';
import { Cart } from './Pages/cart/cart';
import { Wishlist } from './Pages/wishlist/wishlist';
import { Orders } from './Pages/orders/orders';
import { Profile } from './Pages/profile/profile';
import { AdminDashboard } from './Pages/admin/dashboard/dashboard';
import { AdminProducts } from './Pages/admin/products/products';
import { AdminOrders } from './Pages/admin/orders/orders';
import { AdminUsers } from './Pages/admin/users/users';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  // User routes (protected)
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'product/:id', component: ProductDetail, canActivate: [authGuard] },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'wishlist', component: Wishlist, canActivate: [authGuard] },
  { path: 'orders', component: Orders, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },

  // Admin routes (protected)
  { path: 'admin', component: AdminDashboard, canActivate: [adminGuard] },
  { path: 'admin/products', component: AdminProducts, canActivate: [adminGuard] },
  { path: 'admin/orders', component: AdminOrders, canActivate: [adminGuard] },
  { path: 'admin/users', component: AdminUsers, canActivate: [adminGuard] },

  // Fallback
  { path: '**', redirectTo: 'login' },
];
