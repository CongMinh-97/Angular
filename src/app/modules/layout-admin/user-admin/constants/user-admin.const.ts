import { DEPARTMENTS } from '@models/layout-admin/user.model';
import { FieldConfig } from '@shared/components/dynamic-form/dynamic-form.component';
import { UiTone } from '@ui';

export const STATUS_LABEL: Record<string, string> = { active: 'Active', invited: 'Invited', suspended: 'Suspended' };
export const STATUS_TONE: Record<string, UiTone> = { active: 'success', invited: 'info', suspended: 'danger' };
export const ROLE_TONE: Record<string, UiTone> = { Admin: 'neutral', Manager: 'violet', Editor: 'jade', Viewer: 'neutral' };

export const USER_FIELDS: FieldConfig[] = [
  { key: 'name', label: 'Full name', type: 'text', placeholder: 'Nguyễn Văn An', icon: 'user', required: true, minLength: 2, maxLength: 60 },
  { key: 'email', label: 'Work email', type: 'email', placeholder: 'an.nguyen@company.vn', icon: 'mail', required: true, span: 12 },
  {
    key: 'phone',
    label: 'Phone',
    type: 'tel',
    placeholder: '0912345678',
    icon: 'phone',
    span: 12,
    pattern: /^0\d{9}$/,
    errorMessages: { pattern: 'Use 10 digits starting with 0, e.g. 0912345678' },
  },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    required: true,
    span: 12,
    options: [
      { label: 'Admin', value: 'Admin', icon: 'crown', description: 'Full access, including billing' },
      { label: 'Manager', value: 'Manager', icon: 'team', description: 'Manages people in their department' },
      { label: 'Editor', value: 'Editor', icon: 'edit', description: 'Creates and publishes content' },
      { label: 'Viewer', value: 'Viewer', icon: 'eye', description: 'Read-only access' },
    ],
  },
  { key: 'department', label: 'Department', type: 'select', required: true, span: 12, options: DEPARTMENTS.map(d => ({ label: d, value: d })) },
  {
    key: 'status',
    label: 'Account status',
    type: 'radio',
    variant: 'button',
    required: true,
    initial: 'invited',
    hint: 'Invited people get an email and become Active once they sign in.',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Invited', value: 'invited' },
      { label: 'Suspended', value: 'suspended' },
    ],
  },
];
