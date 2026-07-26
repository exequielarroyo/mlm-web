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
import { Admin } from './admin/admin';
import { Orders } from './orders/orders';

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
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  // Any URL without a dedicated page shows the in-development placeholder.
  { path: '**', component: InDevelopment }
];
