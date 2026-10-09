import { User } from '@models/general/auth.model';

/** Shared fixtures for specs. Keep factories small; override only what a test cares about. */
export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 'u-1',
    username: 'admin',
    email: 'admin@harbor.vn',
    fullName: 'Admin Harbor',
    roles: ['admin'],
    ...overrides,
  };
}

/** Clears auth/session keys so tests never leak state through storage. */
export function clearStorage(): void {
  localStorage.clear();
  sessionStorage.clear();
}
