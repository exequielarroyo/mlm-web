import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_BASE } from '../users/user.service';
import { Product } from './product.model';

interface ApiProduct { id: string; name: string; imageUrl: string | null; price: number; discountPercent: number | null; }

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  list(): Observable<Product[]> {
    return this.http.get<ApiProduct[]>(`${API_BASE}/products`).pipe(map((products) => products.map((p) => ({
      id: p.id, name: p.name, image: p.imageUrl || 'https://picsum.photos/seed/product/400', price: p.price,
      discount: p.discountPercent ?? undefined, sold: 0,
    }))));
  }
}
