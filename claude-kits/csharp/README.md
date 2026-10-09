# Claude Code kit: C# / ASP.NET Core

Copy `CLAUDE.md` và `.claude/` vào gốc repo .NET. Xem `../README.md` để biết các bước cài đặt.

Mẫu mặc định giả định dự án dùng:
- Clean Architecture: Domain, Application, Infrastructure, Api.
- MediatR, FluentValidation, EF Core.
- xUnit, FluentAssertions, NSubstitute.

Nếu dự án khác (MVC, Minimal API không có MediatR, Dapper, NUnit hoặc MSTest, Moq), hãy sửa:
- `CLAUDE.md`: phần Commands, Layout, Ground rules.
- `.claude/rules/*.md`: `paths:` và nội dung.
- `.claude/skills/dotnet-testing/references/patterns.md`: đổi sang framework test đang dùng.
- `.claude/skills/crud-feature/references/files.md`: danh sách file cần tạo cho 1 entity.
