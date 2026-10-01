/** Minimal RFC 4180 parser: quoted fields, escaped quotes, CRLF/LF, optional BOM. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const s = text.replace(/^\uFEFF/, '');
  // Excel in vi-VN/EU locales saves CSV with semicolons; pick whichever the header uses more.
  const head = s.split(/\r?\n/, 1)[0];
  const delim = (head.match(/;/g)?.length ?? 0) > (head.match(/,/g)?.length ?? 0) ? ';' : ',';

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"' && s[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        quoted = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === delim) {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter(r => r.some(cell => cell.trim() !== ''));
}

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
