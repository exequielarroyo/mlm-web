import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { AdminService, AdminProduct, AdminOrder, AdminCommission, AdminPayout } from './admin.service';
import { formatPeso } from '../products/product.model';

@Component({ selector: 'app-admin', templateUrl: './admin.html', changeDetection: ChangeDetectionStrategy.Eager })
export class Admin {
  private readonly admin = inject(AdminService);
  protected readonly products = signal<AdminProduct[]>([]);
  protected readonly orders = signal<AdminOrder[]>([]);
  protected readonly commissions = signal<AdminCommission[]>([]);
  protected readonly payouts = signal<AdminPayout[]>([]);
  protected readonly message = signal('');
  protected readonly formatPeso = formatPeso;
  protected readonly draft = signal<Partial<AdminProduct>>({ name: '', price: 0, discountPercent: null, imageUrl: '' });
  ngOnInit() { this.refresh(); }
  protected refresh() {
    this.admin.products().subscribe((x) => this.products.set(x)); this.admin.orders().subscribe((x) => this.orders.set(x));
    this.admin.commissions().subscribe((x) => this.commissions.set(x)); this.admin.payouts().subscribe((x) => this.payouts.set(x));
  }
  protected setDraft(field: keyof AdminProduct, value: string) { this.draft.update((draft) => ({ ...draft, [field]: field === 'price' || field === 'discountPercent' ? (value === '' ? null : Number(value)) : value })); }
  protected edit(product: AdminProduct) { this.draft.set({ ...product }); }
  protected save() { this.admin.saveProduct(this.draft()).subscribe({ next: () => { this.draft.set({ name: '', price: 0, discountPercent: null, imageUrl: '' }); this.message.set('Product saved.'); this.refresh(); }, error: () => this.message.set('Unable to save product.') }); }
  protected archive(id: string) { this.admin.archiveProduct(id).subscribe({ next: () => { this.message.set('Product archived.'); this.refresh(); }, error: () => this.message.set('Unable to archive product.') }); }
  protected complete(id: string) { this.admin.completeOrder(id).subscribe({ next: () => { this.message.set('Order completed and commissions created.'); this.refresh(); }, error: () => this.message.set('Unable to complete order.') }); }
  protected refund(id: string) { this.admin.refundOrder(id).subscribe({ next: () => { this.message.set('Order refunded and commissions adjusted.'); this.refresh(); }, error: () => this.message.set('Unable to refund order.') }); }
  protected createPayout(recipientId: string) { this.admin.createPayout(recipientId).subscribe({ next: () => { this.message.set('Payout batch created.'); this.refresh(); }, error: () => this.message.set('No available commissions for this recipient.') }); }
  protected pay(id: string) { this.admin.markPayoutPaid(id).subscribe({ next: () => { this.message.set('Payout marked paid.'); this.refresh(); }, error: () => this.message.set('Unable to mark payout paid.') }); }
  protected availableRecipients(): string[] { return [...new Set(this.commissions().filter((c) => c.status === 'Available').map((c) => c.recipientId))]; }
}
