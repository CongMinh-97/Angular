import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { PaginatedResponse } from '@models/api-response.model';
import { ListQuery, UserPayload, UserRecord } from '@models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/users`;

  list(q: ListQuery) {
    let params = new HttpParams().set('page', q.page).set('pageSize', q.pageSize);
    if (q.search) params = params.set('search', q.search);
    if (q.sortField && q.sortOrder) params = params.set('sortField', q.sortField).set('sortOrder', q.sortOrder);
    for (const [key, values] of Object.entries(q.filters ?? {})) {
      for (const v of values) params = params.append(key, v);
    }
    return this.http.get<PaginatedResponse<UserRecord>>(this.url, { params });
  }

  create(payload: UserPayload) {
    return this.http.post<UserRecord>(this.url, payload);
  }

  update(id: number, payload: UserPayload) {
    return this.http.put<UserRecord>(`${this.url}/${id}`, payload);
  }

  remove(id: number) {
    return this.http.delete<{ deleted: number }>(`${this.url}/${id}`);
  }

  removeMany(ids: number[]) {
    return this.http.post<{ deleted: number }>(`${this.url}/bulk-delete`, { ids });
  }

  importMany(rows: UserPayload[]) {
    return this.http.post<{ inserted: number; skipped: number }>(`${this.url}/import`, { rows });
  }
}
