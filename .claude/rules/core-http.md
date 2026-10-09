---
paths:
  - "src/app/_core/**"
  - "src/app/app.config.ts"
  - "src/app/app.routes.ts"
  - "src/environments/**"
---

# Core, interceptors and config rules

- Interceptor order in `app.config.ts` matters: `tokenInterceptor` → `errorInterceptor` → `mockBackendInterceptor` (mock last so it sees the auth header). Keep that order.
- `tokenInterceptor` must not set `Content-Type`, so FormData uploads keep their boundary.
- `errorInterceptor` skips `/auth/login` (the form shows inline errors). On 401 it logs out and redirects to `/login?returnUrl=...`. Any new skip rule needs a spec case.
- The mock backend is active only when `environment.mockApi` is true. Production sets it to false. Never ship real secrets or tokens in `environment*.ts`.
- New interceptors and guards are functional (`HttpInterceptorFn`, `CanActivateFn`) and each gets a spec in the same folder.
- Icons must be registered in `_shared/constants/icons.ts` (`APP_ICONS`), otherwise nz-icon fetches them at runtime and fails offline.
