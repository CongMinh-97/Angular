export type UserRole = 'Admin' | 'Manager' | 'Editor' | 'Viewer';
export type UserStatus = 'active' | 'invited' | 'suspended';

export interface UserRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  createdAt: string;
  lastActive: string;
  spend: number;
}

export type UserPayload = Omit<UserRecord, 'id' | 'createdAt' | 'lastActive' | 'spend'> & Partial<Pick<UserRecord, 'spend'>>;

export interface ListQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortField?: string | null;
  sortOrder?: 'ascend' | 'descend' | null;
  filters?: Record<string, string[]>;
}

export const USER_ROLES: UserRole[] = ['Admin', 'Manager', 'Editor', 'Viewer'];
export const USER_STATUSES: UserStatus[] = ['active', 'invited', 'suspended'];
export const DEPARTMENTS = ['Engineering', 'Design', 'Marketing', 'Sales', 'Finance', 'Support', 'Operations'];
