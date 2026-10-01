import { UserPayload } from '@models/layout-admin/user.model';

export interface TargetField {
  key: keyof UserPayload;
  label: string;
  required: boolean;
  aliases: string[];
}

/** User fields a CSV column can be matched to; aliases drive automatic matching. */
export const TARGETS: TargetField[] = [
  { key: 'name', label: 'Full name', required: true, aliases: ['name', 'full name', 'fullname', 'họ tên', 'ho ten'] },
  { key: 'email', label: 'Email', required: true, aliases: ['email', 'email address', 'e-mail', 'mail'] },
  { key: 'phone', label: 'Phone', required: false, aliases: ['phone', 'mobile', 'phone number', 'sđt', 'số điện thoại'] },
  { key: 'role', label: 'Role', required: true, aliases: ['role', 'vai trò', 'permission'] },
  { key: 'department', label: 'Department', required: true, aliases: ['department', 'team', 'phòng ban', 'dept'] },
  { key: 'status', label: 'Status', required: false, aliases: ['status', 'trạng thái', 'state'] },
];

/** Built-in sample with a few deliberate problems, for trying the flow. */
export const SAMPLE_CSV = `Full name,Email address,Mobile,Role,Team,Status
Trần Thị Mai,mai.tran@harbor.vn,0912345678,Editor,Marketing,active
Lê Quốc Bảo,bao.le@harbor.vn,0987654321,Manager,Sales,active
Phạm Gia Huy,huy.pham@harbor,0903111222,Viewer,Support,invited
Nguyễn Hoài An,an.nguyen@harbor.vn,0933444555,Editor,Design,active
,thao.vo@harbor.vn,0977888999,Viewer,Finance,invited
Đỗ Minh Khánh,khanh.do@harbor.vn,12345,Owner,Engineering,active
Bùi Thanh Tâm,tam.bui@harbor.vn,0944555666,Viewer,Operations,suspended
Hoàng Ngọc Lan,lan.hoang@harbor.vn,0966777888,Manager,Engineering,active
Võ Thanh Sơn,son.vo@harbor.vn,0911222333,Editor,Marketing,invited
"Đặng Yến, Jr.",yen.dang@harbor.vn,0922333444,Viewer,Sales,active
`;
