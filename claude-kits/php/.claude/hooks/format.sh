#!/usr/bin/env bash
# PostToolUse (Edit|Write|MultiEdit): format the changed PHP file with Pint (or PHP-CS-Fixer if that's what the project uses).
source "$(dirname "$0")/_lib.sh"
INPUT=$(cat)
FILE=$(json_field "$INPUT" file_path)
[ -z "$FILE" ] || [ ! -f "$FILE" ] && exit 0
case "$FILE" in
  */vendor/*|*/storage/*|*/bootstrap/cache/*) exit 0 ;;
  *.php) ;;
  *) exit 0 ;;
esac

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
if [ -x "$ROOT/vendor/bin/pint" ]; then
  "$ROOT/vendor/bin/pint" -q "$FILE" >/dev/null 2>&1 || true
elif [ -x "$ROOT/vendor/bin/php-cs-fixer" ]; then
  "$ROOT/vendor/bin/php-cs-fixer" fix -q "$FILE" >/dev/null 2>&1 || true
fi
exit 0
