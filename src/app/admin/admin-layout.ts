import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  template: `
    <div class="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <aside class="w-64 border-r border-line-light bg-white dark:bg-gray-900 p-4">
        <h2 class="text-xl font-bold text-primary mb-6">Admin Panel</h2>
        <nav class="space-y-2">
          <a routerLink="dashboard" routerLinkActive="bg-gray-100 dark:bg-gray-800" class="block px-3 py-2 rounded">Dashboard</a>
          <a routerLink="products" routerLinkActive="bg-gray-100 dark:bg-gray-800" class="block px-3 py-2 rounded">Products</a>
          <a routerLink="orders" routerLinkActive="bg-gray-100 dark:bg-gray-800" class="block px-3 py-2 rounded">Orders</a>
          <a routerLink="finance" routerLinkActive="bg-gray-100 dark:bg-gray-800" class="block px-3 py-2 rounded">Finance</a>
          <a routerLink="binary" routerLinkActive="bg-gray-100 dark:bg-gray-800" class="block px-3 py-2 rounded">Binary Placement</a>
        </nav>
      </aside>
      <main class="flex-1 p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  imports: [RouterOutlet, RouterLink, RouterLinkActive]
})
export class AdminLayout {}
