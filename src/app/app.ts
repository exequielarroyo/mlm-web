import { Component, computed, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';

import { UserService } from './users/user.service';
import { CartService } from './cart/cart.service';
import { unitPrice, formatPeso } from './products/product.model';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Footer],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {
  protected readonly userService = inject(UserService);
  private readonly cart = inject(CartService);
  private readonly router = inject(Router);

  protected readonly title = signal('mlm');
  protected readonly currentUser = this.userService.currentUser;
  protected readonly cartCount = this.cart.count;
  protected readonly cartItems = this.cart.items;

  // Hide the header/nav on the full-screen auth pages.
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.split('?')[0]),
      startWith(this.router.url.split('?')[0]),
    ),
    { initialValue: '/' },
  );
  protected readonly showChrome = computed(
    () => !['/login', '/register'].includes(this.currentUrl()),
  );

  // Mobile nav menu toggle.
  protected readonly menuOpen = signal(false);
  protected toggleMenu() {
    this.menuOpen.update((open) => !open);
  }
  protected closeMenu() {
    this.menuOpen.set(false);
  }

  // Price helpers exposed to the template.
  protected readonly unitPrice = unitPrice;
  protected readonly formatPeso = formatPeso;

  protected readonly trending = ['Earbuds', 'Power Bank', 'Smart Watch', 'Yoga Mat', 'Coffee Mug'];

  protected search(term: string) {
    const q = term.trim();
    this.router.navigate(['/search'], { queryParams: q ? { q } : {} });
  }

  /** Up to 5 most-recently-added items for the cart hover dropdown. */
  protected recentItems() {
    return this.cart.items().slice(-5).reverse();
  }

  protected moreCount(): number {
    return Math.max(0, this.cart.items().length - 5);
  }

  isDark = false;

  protected logout() {
    this.userService.logout();
    this.router.navigateByUrl('/');
  }

  ngOnInit() {
    this.userService.initAuth();

    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');

    this.isDark = media.matches;

    media.addEventListener('change', (event) => {
      this.isDark = event.matches;
    });
  }
}
