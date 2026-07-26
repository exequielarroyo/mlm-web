import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../users/user.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly http = inject(HttpClient);
  create(lines: { productId: string; quantity: number }[]): Observable<unknown> {
    return this.http.post(`${API_BASE}/orders`, { lines });
  }
  list(): Observable<MemberOrder[]> { return this.http.get<MemberOrder[]>(`${API_BASE}/orders`); }
}

export interface MemberOrder { id: string; status: string; productSubtotal: number; createdAt: string; lines: { productName: string; quantity: number; lineSubtotal: number }[]; }
