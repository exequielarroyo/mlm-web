import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Users } from './users/users';
import { Login } from './login/login';
import { Referrals } from './referrals/referrals';
import { Network } from './network/network';
import { Community } from './community/community';
import { Earn } from './earn/earn';
import { Cart } from './cart/cart';
import { Search } from './search/search';
import { InDevelopment } from './in-development/in-development';
import { Earnings } from './earnings/earnings';
import { authGuard } from './auth/auth.guard';
import { adminGuard } from './auth/admin.guard';
import { Orders } from './orders/orders';
import { AdminLayout } from './admin/admin-layout';
import { AdminDashboard } from './admin/admin-dashboard';
import { AdminProducts } from './admin/admin-products';
import { AdminOrders } from './admin/admin-orders';
import { AdminFinance } from './admin/admin-finance';
import { AdminBinaryComponent } from './admin/admin-binary';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'community', component: Community },
  { path: 'earn', component: Earn },
  { path: 'cart', component: Cart },
  { path: 'search', component: Search },
  { path: 'register', component: Users },
  { path: 'login', component: Login },
  { path: 'referrals', component: Referrals, canActivate: [authGuard] },
  { path: 'network', component: Network, canActivate: [authGuard] },
  { path: 'earnings', component: Earnings, canActivate: [authGuard] },
  { path: 'orders', component: Orders, canActivate: [authGuard] },
  { path: 'admin', component: AdminLayout, canActivate: [adminGuard], children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: AdminDashboard },
    { path: 'products', component: AdminProducts },
    { path: 'orders', component: AdminOrders },
    { path: 'finance', component: AdminFinance },
    { path: 'binary', component: AdminBinaryComponent }
  ] },
  // Any URL without a dedicated page shows the in-development placeholder.
  { path: '**', component: InDevelopment }
];
