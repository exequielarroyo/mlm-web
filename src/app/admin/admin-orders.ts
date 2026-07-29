import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminOrder } from './admin.service';
import { formatPeso } from '../products/product.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="text-2xl font-semibold mb-6">Order Management</h2>
    
    @if (message()) {
      <p class="mb-4 text-sm text-primary">{{ message() }}</p>
    }

    <div class="space-y-3">
      @for (order of orders(); track order.id) {
        <div class="rounded border border-line-light">
          <div class="flex items-center justify-between gap-4 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900" (click)="toggleOrder(order.id)">
            <div class="flex items-center gap-3 text-sm flex-1 min-w-0">
              <span class="font-mono text-xs text-gray-400">{{ order.id.slice(0, 8) }}…</span>
              <span class="font-medium truncate">{{ order.buyerName || order.buyerId.slice(0, 8) + '…' }}</span>
              @if (order.paymentReference) {
                <span class="text-xs font-mono bg-blue-50 text-blue-700 rounded px-1.5 py-0.5">Ref#{{ order.paymentReference }}</span>
              }
              <span class="text-xs rounded px-2 py-0.5 font-medium"
                [class.bg-yellow-100]="order.status === 'PendingPayment'"
                [class.text-yellow-700]="order.status === 'PendingPayment'"
                [class.bg-green-100]="order.status === 'Completed'"
                [class.text-green-700]="order.status === 'Completed'"
                [class.bg-red-100]="order.status === 'Refunded'"
                [class.text-red-700]="order.status === 'Refunded'">
                {{ order.status }}
              </span>
            </div>
            <span class="text-sm font-semibold text-primary whitespace-nowrap">{{ formatPeso(order.productSubtotal) }}</span>
            <div class="flex gap-2 shrink-0">
              @if (order.status === 'PendingPayment') {
                <button class="btn-primary text-xs px-3 py-1" (click)="complete(order.id); $event.stopPropagation()">Complete</button>
              }
              @if (order.status === 'Completed') {
                <button class="text-red-600 text-xs border border-red-300 rounded px-3 py-1 hover:bg-red-50" (click)="refund(order.id); $event.stopPropagation()">Refund</button>
              }
              <i class="fa-solid text-xs text-gray-400 mt-1" [class.fa-chevron-down]="expandedOrder() !== order.id" [class.fa-chevron-up]="expandedOrder() === order.id"></i>
            </div>
          </div>
          @if (expandedOrder() === order.id) {
            <div class="border-t border-line-light px-3 py-2 text-sm text-gray-500">
              @for (line of order.lines; track line.productName) {
                <div class="flex justify-between py-1">
                  <span>{{ line.productName }} × {{ line.quantity }}</span>
                  <span>{{ formatPeso(line.lineSubtotal) }}</span>
                </div>
              }
            </div>
          }
        </div>
      }
      @empty {
        <p class="text-sm text-gray-500">No orders yet.</p>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminOrders {
  private readonly admin = inject(AdminService);

  protected readonly orders = signal<AdminOrder[]>([]);
  protected readonly message = signal('');
  protected readonly formatPeso = formatPeso;
  protected readonly expandedOrder = signal<string | null>(null);

  ngOnInit() {
    this.refresh();
  }

  protected refresh() {
    this.admin.orders().subscribe({
      next: (x) => this.orders.set(x),
      error: () => this.message.set('Unable to load orders.')
    });
  }

  protected toggleOrder(id: string) {
    this.expandedOrder.update((current) => current === id ? null : id);
  }

  protected complete(id: string) {
    this.admin.completeOrder(id).subscribe({
      next: () => {
        this.message.set('Order completed and commissions created.');
        this.refresh();
      },
      error: (err) => {
        console.error('[Admin] Unable to complete order:', err);
        this.message.set('Unable to complete order.');
      }
    });
  }

  protected refund(id: string) {
    this.admin.refundOrder(id).subscribe({
      next: () => {
        this.message.set('Order refunded and commissions adjusted.');
        this.refresh();
      },
      error: (err) => {
        console.error('[Admin] Unable to refund order:', err);
        this.message.set('Unable to refund order.');
      }
    });
  }
}