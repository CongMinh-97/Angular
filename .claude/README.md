# Khung Claude Code cho dự án Angular

Bộ khung này dựa trên [claude-howto](https://github.com/luongnv89/claude-howto) và được điều chỉnh cho base Angular này. Mục tiêu:

1. Claude làm đúng convention của dự án ngay từ đầu.
2. Có quy trình rõ ràng cho các việc: làm task, fix bug, review code, viết unit test, commit.
3. Tiết kiệm token: chỉ nạp đúng phần ngữ cảnh cần thiết vào thời điểm cần.

> Các file hướng dẫn cho Claude được viết bằng tiếng Anh vì tiếng Anh tốn ít token hơn và Claude làm theo chính xác hơn. Bạn cứ chat với Claude bằng tiếng Việt như bình thường.

## Cấu trúc

```text
CLAUDE.md                     Bộ nhớ dự án (< 100 dòng): stack, lệnh, cấu trúc, quy tắc cốt lõi. Luôn được nạp.
.claude/
├── settings.json             Quyền (allow/ask/deny) + hooks. Commit chung cho cả team.
├── settings.local.json       (tuỳ chọn, bị gitignore) Cấu hình riêng của từng máy.
├── rules/                    Quy tắc theo đường dẫn. CHỈ nạp khi Claude chạm vào file khớp `paths:`
│   ├── angular.md            src/app/**/*.ts|html: component, signal, routing, service
│   ├── ui-kit.md             _shared/components/ui/**: ControlValueAccessor, tên input
│   ├── modules.md            modules/**, _services, _models: cấu trúc module CRUD
│   ├── core-http.md          _core/**, app.config: interceptor, guard, mock
│   ├── testing.md            **/*.spec.ts: quy tắc unit test
│   └── styles.md             **/*.scss: token màu, Tailwind
├── commands/                 Slash command (bạn gõ /tên để chạy)
│   ├── task.md               /task      làm 1 tính năng từ đầu đến cuối
│   ├── fix-bug.md            /fix-bug   sửa bug theo hướng tái hiện trước
│   ├── review.md             /review    review thay đổi hiện tại hoặc cả nhánh
│   ├── test.md               /test      viết hoặc bổ sung unit test
│   ├── new-module.md         /new-module  scaffold trang CRUD
│   ├── commit.md             /commit    conventional commit
│   └── pr.md                 /pr        verify, review, soạn PR
├── agents/                   Subagent, mỗi agent chạy trong context riêng nên không làm phình context chính
│   ├── code-reviewer.md      chỉ đọc, trả về danh sách lỗi đã xếp hạng
│   ├── debugger.md           tìm nguyên nhân gốc + test hồi quy
│   ├── test-engineer.md      viết và chạy spec (model sonnet cho rẻ)
│   └── security-reviewer.md  XSS, auth, secret, dependency
├── skills/                   Quy trình chi tiết. Claude tự nạp khi task khớp mô tả; references/ chỉ đọc khi cần
│   ├── bug-fix/              quy trình 7 bước + template báo cáo
│   ├── angular-review/       checklist + template báo cáo review
│   ├── angular-testing/      mẫu spec cho service, interceptor, guard, store, util, ui-control, page
│   └── crud-module/          bảng các file cần tạo cho 1 entity
└── hooks/                    Script tự động, chạy ngoài model nên không tốn token
    ├── guard-bash.sh         chặn rm -rf /, force push, push thẳng main, reset --hard, --no-verify, cat lockfile
    ├── protect-files.sh      chặn sửa lockfile, dist, node_modules, .env
    ├── format.sh             tự chạy Prettier sau mỗi lần Claude sửa file
    ├── secret-scan.sh        cảnh báo nếu file vừa ghi có API key, token hoặc private key
    └── pre-commit.sh         trước khi `git commit`: typecheck + kiểm tra format, sai thì chặn
src/testing/test-helpers.ts   Fixture dùng chung cho spec
karma.conf.js                 Karma với launcher ChromeHeadlessCI (chạy được trong CI và container)
```

## Cài đặt lần đầu

```bash
npm install
npm run test:ci     # nếu báo không tìm thấy Chrome: export CHROME_BIN=/đường/dẫn/chrome-hoặc-chromium
```

- **Windows:** hooks là script bash, cần Git Bash (đi kèm Git for Windows). Claude Code trên Windows đã dùng Git Bash sẵn.
- Mở Claude Code tại thư mục gốc dự án. Gõ `/memory` để xem CLAUDE.md đã được nạp, `/agents` để xem subagent, `/hooks` để xem hook.

## Quy trình hằng ngày

| Việc | Gõ | Claude sẽ làm |
| --- | --- | --- |
| Làm tính năng | `/task Thêm cột "Phòng ban" vào bảng user, lọc được` | Lập kế hoạch → code → viết spec → chạy spec + typecheck → code-reviewer → `npm run verify` → báo cáo |
| Sửa bug | `/fix-bug Lưu user bị lỗi khi email có dấu cách` | Tìm vị trí → viết spec tái hiện (đỏ) → tìm nguyên nhân gốc → sửa tối thiểu → spec xanh → báo cáo theo template |
| Review | `/review` hoặc `/review main` | Chạy code-reviewer (và security-reviewer nếu đụng auth hoặc upload) → báo cáo Blocking / Should fix / Nits |
| Viết test | `/test src/app/_services` hoặc `/test` (các file vừa sửa) | test-engineer viết spec theo mẫu, chỉ chạy spec của nó, báo cáo bug phát hiện được |
| Trang CRUD mới | `/new-module product name:string price:number status:enum(active,draft)` | Tạo model, service, spec, constants, modal, trang, route, mock API, menu |
| Commit | `/commit` | Conventional commit. Hook chặn nếu typecheck hoặc format lỗi |
| Tạo PR | `/pr` | verify → review → soạn PR, chờ bạn xác nhận |

Bạn cũng có thể chat bình thường, ví dụ "sửa giúp lỗi X". Skill `bug-fix` có mô tả khớp nên Claude vẫn tự áp dụng quy trình.

### Gợi ý cho task lớn
1. Bấm `Shift+Tab` hai lần để vào **Plan mode**. Claude chỉ đọc và lập kế hoạch, chưa sửa gì. Duyệt kế hoạch xong mới cho làm.
2. Nếu Claude đi sai hướng, nhấn `Esc` hai lần hoặc gõ `/rewind` để quay về checkpoint trước.
3. Xong mỗi task, gõ `/clear` trước khi sang task mới (xem phần token bên dưới).

## Khung này tiết kiệm token như thế nào

| Kỹ thuật | Ở đâu | Vì sao tiết kiệm |
| --- | --- | --- |
| CLAUDE.md ngắn (< 100 dòng) | `CLAUDE.md` | File này được nạp ở MỌI lượt chat. Mỗi dòng thừa bị tính phí lặp lại |
| Rule theo đường dẫn | `.claude/rules/*.md` với `paths:` | Rule về SCSS chỉ nạp khi sửa SCSS, rule test chỉ nạp khi sửa spec |
| Skill nạp theo nhu cầu | `.claude/skills/*` | Lúc đầu chỉ nạp mô tả 1 dòng. Nội dung và `references/` chỉ đọc khi dùng |
| Subagent | `.claude/agents/*` | Đọc diff, chạy test, dò log diễn ra trong context riêng. Context chính chỉ nhận bản tóm tắt ngắn |
| Model rẻ cho việc lặp | `test-engineer` dùng `sonnet` | Viết test theo mẫu không cần model mạnh nhất |
| Hook format | `format.sh` | Claude không phải tốn lượt sửa khoảng trắng, dấu phẩy |
| Hook chặn | `guard-bash.sh`, deny Read | Chặn `cat package-lock.json` và grep toàn bộ node_modules, những thứ có thể đổ hàng chục nghìn token vào context |
| Output ngắn | pre-commit, agent | Hook chỉ in vài dòng lỗi đầu. Agent có giới hạn số dòng báo cáo |
| Chạy test hẹp | quy tắc trong CLAUDE.md + skill | Chạy 1 spec bằng `--include` thay vì cả bộ. `verify` chỉ chạy 1 lần cuối |
| Spec mẫu thật | `references/patterns.md` | Trỏ tới spec có sẵn trong repo thay vì chép code mẫu dài vào prompt |

### Thói quen nên có
- **`/clear` giữa các task không liên quan.** Context cũ bị gửi lại ở mỗi lượt và là nguồn tốn token lớn nhất.
- **`/compact`** khi task dài nhưng chưa xong. Có thể thêm gợi ý, ví dụ `/compact giữ lại danh sách file đã sửa và test còn đỏ`.
- **`/context`** để xem phần nào đang chiếm context. **`/cost`** (hoặc `/usage`) để xem chi phí.
- **Chỉ đúng file:** dùng `@src/app/_services/auth.service.ts` thay vì "tìm file auth".
- **Gộp yêu cầu:** "sửa A, B, C rồi chạy test" thay vì ba lượt chat.
- **Đừng thêm câu "nhớ kiểm tra kỹ" vào CLAUDE.md.** Nó làm Claude kiểm tra quá mức và đốt token. Quy trình kiểm tra đã nằm sẵn trong skill và command.
- **Ghi chú cá nhân** (ví dụ "tôi đang làm nhánh X") để trong `CLAUDE.local.md`, file này đã được gitignore.

## Tuỳ biến
- **Thêm quy tắc mới:** nếu chỉ áp dụng cho một thư mục, tạo `.claude/rules/<tên>.md` với `paths:`. Chỉ đưa vào CLAUDE.md khi đúng ở mọi nơi.
- **Thêm quy trình mới:** tạo `.claude/skills/<tên>/SKILL.md`. Phần `description` phải nói rõ *khi nào dùng* để Claude tự nhận ra.
- **Cho phép thêm lệnh không cần hỏi:** thêm vào `permissions.allow` trong `settings.local.json` (riêng máy bạn) hoặc `settings.json` (cả team).
- **Tạm tắt hook:** dùng `/hooks`, hoặc xoá block tương ứng trong `settings.json`.

## Áp dụng cho dự án C# và PHP
Xem thư mục `claude-kits/` ở gốc repo. Mỗi bộ có README hướng dẫn copy vào dự án.
