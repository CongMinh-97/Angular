# Spec patterns

Each section names a passing spec in the repo. Open it and copy the structure.

## 1. Service with HTTP — `src/app/_services/auth.service.spec.ts`
```ts
TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
const http = TestBed.inject(HttpTestingController);
service.list({ page: 1, pageSize: 10 }).subscribe(r => (result = r));
const req = http.expectOne(r => r.url === '/api/users');
expect(req.request.params.get('page')).toBe('1');
req.flush({ items: [], total: 0, page: 1, pageSize: 10, totalPages: 0 });
afterEach(() => http.verify());
```
- Error path: `req.flush({ message: 'x' }, { status: 409, statusText: 'Conflict' })` and assert on the `error` callback.
- When a service reads storage at construction, set storage before `TestBed.inject`, and use `TestBed.resetTestingModule()` to rebuild.

## 2. Functional interceptor — `src/app/_core/_helpers/token.interceptor.spec.ts`, `error.interceptor.spec.ts`
```ts
providers: [
  provideHttpClient(withInterceptors([errorInterceptor])),
  provideHttpClientTesting(),
  { provide: AuthService, useValue: jasmine.createSpyObj('AuthService', ['logout']) },
  { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate'], { url: '/users' }) },
]
```
Drive requests through `HttpClient`, then assert on headers or spies.

## 3. Functional guard — `src/app/_core/_helpers/guard/auth.guard.spec.ts`
```ts
const result = TestBed.runInInjectionContext(() => authGuard({} as ActivatedRouteSnapshot, { url: '/x' } as RouterStateSnapshot));
expect((result as UrlTree).toString()).toBe('/login?returnUrl=%2Fx');
```
Needs `provideRouter([])` for `createUrlTree`.

## 4. Signal store — `src/app/_store/global.store.spec.ts`
Inject, call methods, read signals synchronously. Clear storage keys in `beforeEach` and `afterEach`.

## 5. Pure util — `src/app/modules/layout-admin/import-user-admin/utils/csv.spec.ts`
No TestBed. Use table-style cases for parsers and validators.

## 6. ui-* form control — `src/app/_shared/components/ui/forms/ui-input.component.spec.ts`
Test through a host component, once per mode:
```ts
@Component({ standalone: true, imports: [UiSelectComponent, ReactiveFormsModule],
  template: `<ui-select [formControl]="ctrl" label="Role" [options]="opts" />` })
class ReactiveHost { ctrl = new FormControl<string | null>(null, Validators.required); opts = [...] }

@Component({ standalone: true, imports: [UiSelectComponent, FormsModule],
  template: `<ui-select [(ngModel)]="role" name="role" [options]="opts" />` })
class NgModelHost { role = 'admin'; opts = [...] }   // ngModel writes async: await fixture.whenStable()

@Component({ standalone: true, imports: [UiSelectComponent],
  template: `<ui-select [(value)]="role" [options]="opts" />` })
class StandaloneHost { role = signal<string | null>(null); opts = [...] }
```
Assert on: value in → DOM, user change → model, required mark/error after `markAsTouched()`, disabled state, `nzStatus` error class.
Add `provideNoopAnimations()`. For ng-zorro overlays (select dropdown, date panel), prefer setting the value through the control API over clicking the overlay.

## 7. Page component (list + modal)
```ts
const users = jasmine.createSpyObj<UserService>('UserService', ['list', 'remove']);
users.list.and.returnValue(of({ items: [makeRecord()], total: 1, page: 1, pageSize: 10, totalPages: 1 }));
TestBed.configureTestingModule({
  imports: [UserAdminComponent],
  providers: [provideNoopAnimations(), provideRouter([]), { provide: UserService, useValue: users },
    { provide: UiDialogService, useValue: jasmine.createSpyObj('UiDialogService', { confirm: Promise.resolve(true), success: undefined }) }],
});
```
Check that the initial load calls `list` with the default `ListQuery`, that confirming a delete calls `remove(id)` and reloads, and that cancelling does not. Stub heavy children (chart, editor) with `TestBed.overrideComponent(X, { set: { imports: [], template: '' } })` when they are irrelevant.

## 8. Timers and debounce
`fakeAsync(() => { ...; tick(300); ... })`. Use `flush()` to drain. Do not use real `setTimeout` waits.
