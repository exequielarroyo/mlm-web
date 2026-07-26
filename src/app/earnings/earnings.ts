import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { EarningsService, EarningsSummary, Commission, Payout } from './earnings.service';
import { formatPeso } from '../products/product.model';

@Component({ selector: 'app-earnings', templateUrl: './earnings.html', changeDetection: ChangeDetectionStrategy.Eager })
export class Earnings {
  private readonly earnings = inject(EarningsService);
  protected readonly summary = signal<EarningsSummary | null>(null);
  protected readonly commissions = signal<Commission[]>([]);
  protected readonly payouts = signal<Payout[]>([]);
  protected readonly formatPeso = formatPeso;
  ngOnInit() {
    this.earnings.summary().subscribe((value) => this.summary.set(value));
    this.earnings.commissions().subscribe((value) => this.commissions.set(value));
    this.earnings.payouts().subscribe((value) => this.payouts.set(value));
  }
}
