import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../users/user.service';

export interface EarningsSummary { available: number; paid: number; reversed: number; recoveryRequired: number; }
export interface Commission { id: string; orderId: string; buyerName: string; level: number; rate: number; commissionableAmount: number; amount: number; status: string; createdAt: string; paidAt: string | null; }
export interface Payout { id: string; amount: number; status: string; createdAt: string; paidAt: string | null; }

@Injectable({ providedIn: 'root' })
export class EarningsService {
  private readonly http = inject(HttpClient);
  summary(): Observable<EarningsSummary> { return this.http.get<EarningsSummary>(`${API_BASE}/me/earnings`); }
  commissions(): Observable<Commission[]> { return this.http.get<Commission[]>(`${API_BASE}/me/commissions`); }
  payouts(): Observable<Payout[]> { return this.http.get<Payout[]>(`${API_BASE}/me/payouts`); }
}
