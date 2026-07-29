import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE } from '../users/user.service';
import { BinaryTree, BinaryPair, BinaryStats } from './binary.model';

@Injectable({ providedIn: 'root' })
export class BinaryService {
  private readonly http = inject(HttpClient);

  tree(): Observable<BinaryTree> {
    return this.http.get<BinaryTree>(`${API_BASE}/binary/tree`);
  }

  stats(): Observable<BinaryStats> {
    return this.http.get<BinaryStats>(`${API_BASE}/binary/stats`);
  }

  pairs(): Observable<BinaryPair[]> {
    return this.http.get<BinaryPair[]>(`${API_BASE}/binary/pairs`);
  }
}
