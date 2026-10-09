import { parseCsv } from './csv';

describe('parseCsv', () => {
  it('parses comma-separated rows', () => {
    expect(parseCsv('name,email\nAn,an@x.vn')).toEqual([
      ['name', 'email'],
      ['An', 'an@x.vn'],
    ]);
  });

  it('detects semicolon delimiters from the header', () => {
    expect(parseCsv('name;email\nAn;an@x.vn')).toEqual([
      ['name', 'email'],
      ['An', 'an@x.vn'],
    ]);
  });

  it('keeps delimiters, newlines and escaped quotes inside quoted fields', () => {
    expect(parseCsv('a,b\n"x, y","he said ""hi""\nline 2"')).toEqual([
      ['a', 'b'],
      ['x, y', 'he said "hi"\nline 2'],
    ]);
  });

  it('handles CRLF, a BOM and blank lines', () => {
    expect(parseCsv('﻿a,b\r\n1,2\r\n\r\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ]);
  });

  it('returns an empty array for empty input', () => {
    expect(parseCsv('')).toEqual([]);
  });
});
