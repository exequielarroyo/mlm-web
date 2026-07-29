import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE } from '../users/user.service';

export interface UserSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  userName: string | null;
  referralCode: string;
  email: string | null;
}

@Injectable({ providedIn: 'root' })
export class AdminBinaryService {
  private readonly http = inject(HttpClient);

  searchUsers(query: string): Observable<UserSearchResult[]> {
    return this.http.get<UserSearchResult[]>(`${API_BASE}/admin/users/search`, {
      params: { q: query }
    });
  }

  placeMember(sponsorId: string, newUserId: string, position: 'Left' | 'Right'): Observable<void> {
    return this.http.post<void>(`${API_BASE}/admin/binary/place`, {
      SponsorId: sponsorId,
      NewUserId: newUserId,
      Position: position
    });
  }
}
