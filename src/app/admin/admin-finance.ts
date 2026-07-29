import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminCommission, AdminPayout, AvailableRecipient } from './admin.service';
import { formatPeso } from '../products/product.model';

@Component({
  selector: 'app-admin-finance',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-2xl font-bold dark:text-white">Finance & Payouts</h2>
      <button type="button" class="btn-primary" (click)="refresh()">Refresh</button>
    </div>

    @if (message()) {
      <p class="mb-4 text-sm text-primary">{{ message() }}</p>
    }

    <!-- Available commission payouts -->
    <section class="mb-8 bg-white dark:bg-gray-900 rounded border border-line-light p-4">
      <h3 class="font-semibold dark:text-white mb-3">Available Commission Payouts</h3>
      <ul class="text-sm divide-y divide-line-light">
        @for (recipient of availableRecipients(); track recipient.recipientId) {
          <li class="py-3 flex items-center justify-between gap-2">
            <div class="flex flex-col">
              <span class="font-mono text-xs text-gray-500">{{ recipient.recipientId }}</span>
            </div>
            <button class="btn-primary text-xs px-4 py-1.5" (click)="createPayout(recipient.recipientId)">Create Payout</button>
          </li>
        }
        @empty {
          <li class="text-gray-500 py-2">No available commissions.</li>
        }
      </ul>
    </section>

    <!-- Payout batches -->
    <section class="bg-white dark:bg-gray-900 rounded border border-line-light p-4">
      <h3 class="font-semibold dark:text-white mb-3">Payout Batches</h3>
      <ul class="text-sm divide-y divide-line-light">
        @for (payout of payouts(); track payout.id) {
          <li class="py-3 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span class="font-semibold text-base">{{ formatPeso(payout.amount) }}</span>
              <span class="text-xs rounded px-2 py-0.5 font-medium"
                [class.bg-gray-100]="payout.status === 'Draft'"
                [class.text-gray-600]="payout.status === 'Draft'"
                [class.bg-green-100]="payout.status === 'Paid'"
                [class.text-green-700]="payout.status === 'Paid'">
                {{ payout.status }}
              </span>
            </div>
            @if (payout.status === 'Draft') {
              <button class="text-primary text-xs border border-primary/30 rounded px-3 py-1.5 hover:bg-primary/5 font-semibold" (click)="pay(payout.id)">Mark Paid</button>
            }
          </li>
        }
        @empty {
          <li class="text-gray-500 py-2">No payout batches created yet.</li>
        }
      </ul>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminFinance {
  private readonly admin = inject(AdminService);

  protected readonly commissions = signal<AdminCommission[]>([]);
  protected readonly payouts = signal<AdminPayout[]>([]);
  protected readonly availableRecipients = signal<AvailableRecipient[]>([]);
  protected readonly message = signal('');
  protected readonly formatPeso = formatPeso;

  ngOnInit() {
    this.refresh();
  }

  protected refresh() {
    this.admin.commissions().subscribe({
      next: (x) => this.commissions.set(x),
      error: () => this.message.set('Unable to load commissions.')
    });
    this.admin.payouts().subscribe({
      next: (x) => this.payouts.set(x),
      error: () => this.message.set('Unable to load payouts.')
    });
    this.admin.availableRecipients().subscribe({
      next: (x) => this.availableRecipients.set(x),
      error: () => this.message.set('Unable to load available recipients.')
    });
  }

  protected createPayout(recipientId: string) {
    this.admin.createPayout(recipientId).subscribe({
      next: () => {
        this.message.set('Payout batch created successfully.');
        this.refresh();
      },
      error: () => this.message.set('No available commissions or binary pairs found for this recipient.')
    });
  }

  protected pay(id: string) {
    this.admin.markPayoutPaid(id).subscribe({
      next: () => {
        this.message.set('Payout marked as paid.');
        this.refresh();
      },
      error: () => this.message.set('Unable to mark payout as paid.')
    });
  }
}
