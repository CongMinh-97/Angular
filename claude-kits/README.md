# Claude Code kits cho dự án C# và PHP

Hai bộ khung này có cùng triết lý với bộ Angular ở gốc repo (`CLAUDE.md` + `.claude/`, xem `.claude/README.md` để hiểu chi tiết từng phần và cách tiết kiệm token). Mỗi bộ đã được điều chỉnh theo hệ sinh thái riêng.

| | Angular (gốc repo) | C# / .NET (`csharp/`) | PHP / Laravel (`php/`) |
| --- | --- | --- | --- |
| Test | Karma + Jasmine | xUnit + FluentAssertions + NSubstitute | Pest / PHPUnit |
| Kiểm tra tĩnh | `tsc --noEmit` | `dotnet build -warnaserror` | PHPStan / Larastan, `php -l` |
| Format (hook tự chạy) | Prettier | CSharpier (nếu cài), `dotnet format` khi commit | Pint (hoặc PHP-CS-Fixer) |
| Rule theo thư mục | angular, ui-kit, modules, core-http, testing, styles | csharp, api, data (EF), testing | php, http, database, views, testing |
| Skill | bug-fix, angular-review, angular-testing, crud-module | bug-fix, dotnet-review, dotnet-testing, crud-feature | bug-fix, php-review, php-testing, crud-feature |
| Lệnh | /task /fix-bug /review /test /new-module /commit /pr | /task /fix-bug /review /test /new-feature /commit /pr | như C# |
| Agent | code-reviewer, debugger, test-engineer (sonnet), security-reviewer | như Angular | như Angular |
| Hook chặn riêng | lockfile, dist, cat package-lock, grep toàn node_modules | bin/obj, *.Designer.cs, migration đã commit, `dotnet ef database update/drop` | vendor, composer.lock, migration đã commit, `migrate:fresh`/`db:wipe`/`--force` |

## Cài vào dự án

```bash
# C#
cp -r claude-kits/csharp/.claude  /path/to/your-dotnet-repo/
cp    claude-kits/csharp/CLAUDE.md /path/to/your-dotnet-repo/

# PHP
cp -r claude-kits/php/.claude  /path/to/your-laravel-repo/
cp    claude-kits/php/CLAUDE.md /path/to/your-laravel-repo/
```

Sau đó:
1. **Sửa `CLAUDE.md`**: điền các chỗ `<...>` (tên dự án, phiên bản, DB, cấu trúc thư mục thật) rồi xoá dòng comment đầu file. Nếu cấu trúc dự án khác mẫu (ví dụ không dùng Clean Architecture hoặc MediatR, hay dùng Symfony thay vì Laravel), sửa lại phần Layout và Ground rules, đồng thời sửa `paths:` trong `.claude/rules/*.md` cho khớp.
2. **Thêm vào `.gitignore`:**
   ```gitignore
   .claude/settings.local.json
   .claude/hooks/*.log
   CLAUDE.local.md
   ```
3. **Cài công cụ để hook hoạt động đầy đủ** (thiếu công cụ nào thì hook đó tự bỏ qua, không gây lỗi):
   - C#: `dotnet tool install -g csharpier`.
   - PHP: `composer require --dev laravel/pint larastan/larastan pestphp/pest`.
4. **Hoặc để Claude tự điều chỉnh:** mở Claude Code trong dự án và gõ:
   > Đọc CLAUDE.md và .claude/rules, so với cấu trúc thực tế của repo này rồi cập nhật cho khớp (đường dẫn, lệnh build/test, convention). Giữ CLAUDE.md dưới 100 dòng.

## Kiểm tra sau khi cài
- `/memory`: CLAUDE.md đã được nạp.
- `/agents`: thấy 4 agent.
- `/hooks`: thấy các hook PreToolUse và PostToolUse.
- Gõ thử `/review` khi có thay đổi chưa commit.

Hooks là script bash. Trên Windows cần Git Bash (Claude Code dùng sẵn). `_lib.sh` đọc JSON bằng node hoặc python3 nếu có, không có thì dùng sed.
