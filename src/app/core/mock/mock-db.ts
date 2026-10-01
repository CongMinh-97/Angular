import { DEPARTMENTS, USER_ROLES, UserRecord, UserStatus } from '@models/user.model';

const FIRST = ['Linh', 'Minh', 'An', 'Bảo', 'Châu', 'Duy', 'Giang', 'Hà', 'Huy', 'Khánh', 'Lan', 'Long', 'Mai', 'Nam', 'Ngọc', 'Phúc', 'Quân', 'Sơn', 'Tâm', 'Thảo', 'Trang', 'Tú', 'Vy', 'Yến'];
const LAST = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Huỳnh'];
const MIDDLE = ['Văn', 'Thị', 'Minh', 'Gia', 'Quốc', 'Thanh', 'Hoài'];

// Deterministic PRNG so the demo data is identical on every reload.
function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function slug(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase();
}

function seedUsers(): UserRecord[] {
  const r = rng(42);
  const pick = <T>(a: T[]) => a[Math.floor(r() * a.length)];
  const statuses: UserStatus[] = ['active', 'active', 'active', 'active', 'invited', 'suspended'];
  const now = Date.UTC(2026, 8, 30);
  return Array.from({ length: 86 }, (_, i) => {
    const first = pick(FIRST);
    const last = pick(LAST);
    const name = `${last} ${pick(MIDDLE)} ${first}`;
    const created = now - Math.floor(r() * 720) * 86400000;
    return {
      id: i + 1,
      name,
      email: `${slug(first)}.${slug(last)}${i + 1}@harbor.vn`,
      phone: `09${Math.floor(10000000 + r() * 89999999)}`,
      role: i === 0 ? 'Admin' : pick(USER_ROLES),
      department: pick(DEPARTMENTS),
      status: i === 0 ? 'active' : pick(statuses),
      createdAt: new Date(created).toISOString(),
      lastActive: new Date(now - Math.floor(r() * 30) * 3600000 * 6).toISOString(),
      spend: Math.round(r() * 48000) / 1,
    };
  });
}

export const mockDb = {
  users: seedUsers(),
  nextId: 87,
};
