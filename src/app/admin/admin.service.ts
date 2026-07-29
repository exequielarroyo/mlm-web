import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../users/user.service';

export interface AdminProduct { id: string; name: string; imageUrl: string | null; price: number; discountPercent: number | null; isArchived: boolean; }
export interface AdminOrderLine { productName: string; quantity: number; lineSubtotal: number; }
export interface AdminOrder { id: string; buyerId: string; buyerName: string; status: string; paymentReference: string | null; productSubtotal: number; createdAt: string; lines: AdminOrderLine[]; }
export interface AdminCommission { id: string; recipientId: string; amount: number; status: string; }
export interface AdminPayout { id: string; amount: number; status: string; createdAt: string; }

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  products(): Observable<AdminProduct[]> { return this.http.get<AdminProduct[]>(`${API_BASE}/admin/products/`); }
  saveProduct(product: Partial<AdminProduct>): Observable<AdminProduct> {
    const body = { name: product.name, imageUrl: product.imageUrl || null, price: Number(product.price), discountPercent: product.discountPercent ?? null };
    return product.id ? this.http.put<AdminProduct>(`${API_BASE}/admin/products/${product.id}`, body) : this.http.post<AdminProduct>(`${API_BASE}/admin/products/`, body);
  }
  archiveProduct(id: string): Observable<void> { return this.http.post<void>(`${API_BASE}/admin/products/${id}/archive`, {}); }
  orders(): Observable<AdminOrder[]> { return this.http.get<AdminOrder[]>(`${API_BASE}/admin/orders/`); }
  completeOrder(id: string): Observable<AdminOrder> { return this.http.post<AdminOrder>(`${API_BASE}/admin/orders/${id}/complete`, {}); }
  refundOrder(id: string): Observable<AdminOrder> { return this.http.post<AdminOrder>(`${API_BASE}/admin/orders/${id}/refund`, {}); }
  commissions(): Observable<AdminCommission[]> { return this.http.get<AdminCommission[]>(`${API_BASE}/admin/commissions`); }
  payouts(): Observable<AdminPayout[]> { return this.http.get<AdminPayout[]>(`${API_BASE}/admin/payouts/`); }
  createPayout(recipientId: string): Observable<AdminPayout> { return this.http.post<AdminPayout>(`${API_BASE}/admin/payouts/`, { recipientId, commissionIds: null }); }
  markPayoutPaid(id: string): Observable<AdminPayout> { return this.http.post<AdminPayout>(`${API_BASE}/admin/payouts/${id}/paid`, {}); }
}
