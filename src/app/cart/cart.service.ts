import { Injectable, computed, signal } from '@angular/core';

import { Product, unitPrice } from '../products/product.model';

export interface CartItem {
  product: Product;
  qty: number;
  selected: boolean;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>([]);

  /** Total number of units in the cart (drives the header badge). */
  readonly count = computed(() => this.items().reduce((total, item) => total + item.qty, 0));

  readonly selectedCount = computed(() =>
    this.items().reduce((total, item) => total + (item.selected ? item.qty : 0), 0)
  );

  readonly selectedTotal = computed(() =>
    this.items().reduce((total, item) => total + (item.selected ? unitPrice(item.product) * item.qty : 0), 0)
  );

  readonly allSelected = computed(() => {
    const items = this.items();
    return items.length > 0 && items.every((item) => item.selected);
  });

  add(product: Product): void {
    this.items.update((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      if (existing) {
        return items.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...items, { product, qty: 1, selected: true }];
    });
  }

  setQty(productId: string | number, qty: number): void {
    const safeQty = Math.max(1, Math.floor(qty) || 1);
    this.items.update((items) =>
      items.map((item) => (item.product.id === productId ? { ...item, qty: safeQty } : item))
    );
  }

  increment(productId: string | number): void {
    this.items.update((items) =>
      items.map((item) => (item.product.id === productId ? { ...item, qty: item.qty + 1 } : item))
    );
  }

  decrement(productId: string | number): void {
    this.items.update((items) =>
      items.map((item) =>
        item.product.id === productId ? { ...item, qty: Math.max(1, item.qty - 1) } : item
      )
    );
  }

  remove(productId: string | number): void {
    this.items.update((items) => items.filter((item) => item.product.id !== productId));
  }

  toggleSelected(productId: string | number): void {
    this.items.update((items) =>
      items.map((item) =>
        item.product.id === productId ? { ...item, selected: !item.selected } : item
      )
    );
  }

  setAllSelected(selected: boolean): void {
    this.items.update((items) => items.map((item) => ({ ...item, selected })));
  }

  removeSelected(): void {
    this.items.update((items) => items.filter((item) => !item.selected));
  }
}
