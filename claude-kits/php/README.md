# Claude Code kit: PHP / Laravel

Copy `CLAUDE.md` và `.claude/` vào gốc repo PHP. Xem `../README.md` để biết các bước cài đặt.

Mẫu mặc định giả định dự án dùng:
- Laravel 11 hoặc 12.
- Pest (vẫn chạy được với PHPUnit).
- Larastan, Pint.
- FormRequest, Policy, Action/Service, API Resource.

Nếu dự án là Symfony hoặc PHP thuần, hãy sửa:
- `CLAUDE.md`: lệnh `php artisan` thành `bin/console` hoặc `vendor/bin/phpunit`; cập nhật Layout.
- `.claude/rules/http.md` và `database.md`: đổi sang Controller/Route attribute, Doctrine Entity/Repository, Migrations của Doctrine.
- `.claude/hooks/guard-bash.sh`: đổi các lệnh DB nguy hiểm (`doctrine:schema:drop`, `doctrine:database:drop`).
- `.claude/skills/php-testing/references/patterns.md`: đổi sang WebTestCase hoặc KernelTestCase.
