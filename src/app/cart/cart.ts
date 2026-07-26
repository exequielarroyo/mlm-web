import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { CartItem, CartService } from './cart.service';
import { unitPrice, formatPeso } from '../products/product.model';
import { OrderService } from '../orders/order.service';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './cart.html',
})
export class Cart {
  private readonly cartService = inject(CartService);
  private readonly orders = inject(OrderService);
  private readonly users = inject(UserService);
  private readonly router = inject(Router);
  protected readonly checkoutMessage = signal('');

  protected readonly items = this.cartService.items;
  protected readonly allSelected = this.cartService.allSelected;
  protected readonly selectedCount = this.cartService.selectedCount;
  protected readonly selectedTotal = this.cartService.selectedTotal;

  protected readonly unitPrice = unitPrice;
  protected readonly formatPeso = formatPeso;

  protected lineTotal(item: CartItem): number {
    return unitPrice(item.product) * item.qty;
  }

  protected toggle(id: string | number) {
    this.cartService.toggleSelected(id);
  }

  protected toggleAll(event: Event) {
    this.cartService.setAllSelected((event.target as HTMLInputElement).checked);
  }

  protected inc(id: string | number) {
    this.cartService.increment(id);
  }

  protected dec(id: string | number) {
    this.cartService.decrement(id);
  }

  protected setQty(id: string | number, event: Event) {
    this.cartService.setQty(id, Number((event.target as HTMLInputElement).value));
  }

  protected remove(id: string | number) {
    this.cartService.remove(id);
  }

  protected removeSelected() {
    this.cartService.removeSelected();
  }

  protected checkout() {
    const selected = this.items().filter((item) => item.selected);
    if (!this.users.isAuthenticated()) { this.router.navigate(['/login']); return; }
    if (selected.length === 0) { this.checkoutMessage.set('Select at least one product.'); return; }
    this.orders.create(selected.map((item) => ({ productId: String(item.product.id), quantity: item.qty }))).subscribe({
      next: () => { this.cartService.removeSelected(); this.checkoutMessage.set('Order submitted. An administrator will confirm payment.'); },
      error: () => this.checkoutMessage.set('Unable to submit the order. Please try again.'),
    });
  }
}
