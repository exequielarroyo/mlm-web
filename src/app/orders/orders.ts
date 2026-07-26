import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { OrderService, MemberOrder } from './order.service';
import { formatPeso } from '../products/product.model';

@Component({ selector: 'app-orders', templateUrl: './orders.html', changeDetection: ChangeDetectionStrategy.Eager })
export class Orders {
  private readonly ordersService = inject(OrderService);
  protected readonly orders = signal<MemberOrder[]>([]);
  protected readonly formatPeso = formatPeso;
  ngOnInit() { this.ordersService.list().subscribe((orders) => this.orders.set(orders)); }
}
