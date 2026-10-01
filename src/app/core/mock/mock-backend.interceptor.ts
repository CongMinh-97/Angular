import { HttpErrorResponse, HttpInterceptorFn, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, defer, delay, from, of, switchMap, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { LoginResponse } from '@models/auth.model';
import { PaginatedResponse } from '@models/api-response.model';
import { UserPayload, UserRecord } from '@models/user.model';
import { mockDb } from './mock-db';

const DEMO_PASSWORD = 'password123';
const LATENCY = 350;

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.mockApi || !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }
  const path = req.url.slice(environment.apiUrl.length);
  return defer(() => route(req, path)).pipe(delay(LATENCY));
};

function ok<T>(body: T, status = 200) {
  return of(new HttpResponse({ status, body }));
}

function fail(status: number, message: string) {
  return throwError(() => new HttpErrorResponse({ status, error: { message }, statusText: message }));
}

function route(req: HttpRequest<unknown>, path: string): Observable<HttpResponse<unknown>> {
  const m = req.method;
  const idMatch = path.match(/^\/users\/(\d+)$/);

  if (m === 'POST' && path === '/auth/login') return login(req.body as { username: string; password: string });
  if (m === 'GET' && path === '/users') return ok(listUsers(req.params));
  if (m === 'POST' && path === '/users') return createUser(req.body as UserPayload);
  if (m === 'POST' && path === '/users/bulk-delete') return bulkDelete((req.body as { ids: number[] }).ids);
  if (m === 'POST' && path === '/users/import') return importUsers((req.body as { rows: UserPayload[] }).rows);
  if (idMatch && m === 'PUT') return updateUser(+idMatch[1], req.body as UserPayload);
  if (idMatch && m === 'DELETE') return bulkDelete([+idMatch[1]]);
  if (m === 'POST' && path === '/uploads') return upload(req.body as FormData);

  return fail(404, `Mock API has no route for ${m} ${path}`);
}

function login(body: { username: string; password: string }) {
  const id = (body.username || '').trim().toLowerCase();
  if (!['admin', 'admin@harbor.vn'].includes(id) || body.password !== DEMO_PASSWORD) {
    return fail(401, 'Email or password is incorrect.');
  }
  const res: LoginResponse = {
    token: 'mock.' + btoa(`${id}:${Date.now()}`),
    user: { id: '1', username: 'admin', email: 'admin@harbor.vn', fullName: 'Nguyễn Minh Anh', roles: ['Admin'] },
  };
  return ok(res);
}

function listUsers(params: HttpParams): PaginatedResponse<UserRecord> {
  const page = +(params.get('page') || 1);
  const pageSize = +(params.get('pageSize') || 10);
  const search = (params.get('search') || '').toLowerCase().trim();
  const sortField = params.get('sortField') as keyof UserRecord | null;
  const sortOrder = params.get('sortOrder');
  const roles = params.getAll('role') || [];
  const statuses = params.getAll('status') || [];
  const departments = params.getAll('department') || [];

  let rows = mockDb.users.filter(u =>
    (!search || u.name.toLowerCase().includes(search) || u.email.includes(search) || u.phone.includes(search)) &&
    (!roles.length || roles.includes(u.role)) &&
    (!statuses.length || statuses.includes(u.status)) &&
    (!departments.length || departments.includes(u.department)),
  );

  if (sortField && sortOrder) {
    const dir = sortOrder === 'ascend' ? 1 : -1;
    rows = [...rows].sort((a, b) => (a[sortField] > b[sortField] ? dir : a[sortField] < b[sortField] ? -dir : 0));
  }

  const total = rows.length;
  return {
    items: rows.slice((page - 1) * pageSize, page * pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

function emailTaken(email: string, exceptId?: number) {
  return mockDb.users.some(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== exceptId);
}

function createUser(p: UserPayload) {
  if (emailTaken(p.email)) return fail(409, `${p.email} is already in use.`);
  const now = new Date().toISOString();
  const user: UserRecord = { spend: 0, ...p, id: mockDb.nextId++, createdAt: now, lastActive: now };
  mockDb.users.unshift(user);
  return ok(user, 201);
}

function updateUser(id: number, p: UserPayload) {
  const i = mockDb.users.findIndex(u => u.id === id);
  if (i < 0) return fail(404, 'User not found.');
  if (emailTaken(p.email, id)) return fail(409, `${p.email} is already in use.`);
  mockDb.users[i] = { ...mockDb.users[i], ...p };
  return ok(mockDb.users[i]);
}

function bulkDelete(ids: number[]) {
  const before = mockDb.users.length;
  mockDb.users = mockDb.users.filter(u => !ids.includes(u.id));
  return ok({ deleted: before - mockDb.users.length });
}

function importUsers(rows: UserPayload[]) {
  let inserted = 0;
  let skipped = 0;
  const now = new Date().toISOString();
  for (const p of rows) {
    if (emailTaken(p.email)) {
      skipped++;
      continue;
    }
    mockDb.users.unshift({ spend: 0, ...p, id: mockDb.nextId++, createdAt: now, lastActive: now });
    inserted++;
  }
  return ok({ inserted, skipped });
}

function upload(form: FormData) {
  const file = form.get('upload') as File | null;
  if (!file) return fail(400, 'No file received.');
  if (file.size > 5 * 1024 * 1024) return fail(413, 'Images must be 5 MB or smaller.');
  // A real server would store the file and return its public URL; the mock returns a data URL.
  return from(
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    }),
  ).pipe(switchMap(url => ok({ url })));
}
