import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { OrderService, MemberOrder } from './order.service';
import { formatPeso } from '../products/product.model';

@Component({ selector: 'app-orders', templateUrl: './orders.html', changeDetection: ChangeDetectionStrategy.Eager })
export class Orders {
  private readonly ordersService = inject(OrderService);
  protected readonly orders = signal<MemberOrder[]>([]);
  protected readonly formatPeso = formatPeso;
  protected readonly paymentRefs = signal<Record<string, string>>({});

  ngOnInit() { this.ordersService.list().subscribe((orders) => this.orders.set(orders)); }

  protected setRef(orderId: string, event: Event) {
    this.paymentRefs.update(refs => ({ ...refs, [orderId]: (event.target as HTMLInputElement).value }));
  }

  protected submitPayment(orderId: string) {
    const ref = this.paymentRefs()[orderId];
    if (!ref) return;
    this.ordersService.submitPayment(orderId, ref).subscribe(() => this.ordersService.list().subscribe((orders) => this.orders.set(orders)));
  }
}
