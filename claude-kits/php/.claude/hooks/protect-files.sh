#!/usr/bin/env bash
# PreToolUse (Edit|Write|MultiEdit): keep Claude out of vendored, generated, secret and already-run migration files.
source "$(dirname "$0")/_lib.sh"
INPUT=$(cat)
FILE=$(json_field "$INPUT" file_path)
[ -z "$FILE" ] && exit 0

case "$FILE" in
  *composer.lock|*package-lock.json|*yarn.lock|*pnpm-lock.yaml)
    block "Blocked: lockfiles are generated. Use composer require/update (or npm) instead of editing $FILE." ;;
  */vendor/*|*/node_modules/*|*/bootstrap/cache/*|*/public/build/*|*/storage/framework/*)
    block "Blocked: $FILE is vendored or generated. Change the source instead." ;;
  *.env|*.env.*|*/auth.json|*.pem|*.key)
    case "$FILE" in *.env.example) ;; *) block "Blocked: $FILE may hold secrets. Ask the user to edit it (.env.example is fine)." ;; esac ;;
esac

# Committed migrations are immutable. Editing a migration created in this change is fine.
case "$FILE" in
  */database/migrations/*.php)
    if [ -f "$FILE" ] && git -C "$(dirname "$FILE")" ls-files --error-unmatch "$FILE" >/dev/null 2>&1; then
      block "Blocked: $FILE is a committed migration. Create a new migration (php artisan make:migration) instead."
    fi ;;
esac
exit 0
