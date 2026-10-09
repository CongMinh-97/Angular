#!/usr/bin/env bash
# PostToolUse (Edit|Write|MultiEdit): run Prettier on the file Claude just changed.
# Formatting here means Claude never spends tokens fixing whitespace by hand.
source "$(dirname "$0")/_lib.sh"
INPUT=$(cat)
FILE=$(json_field "$INPUT" file_path)
[ -z "$FILE" ] || [ ! -f "$FILE" ] && exit 0

case "$FILE" in
  */node_modules/*|*/dist/*|*/.angular/*) exit 0 ;;
  *.ts|*.html|*.scss|*.css|*.json|*.js|*.mjs) ;;
  *) exit 0 ;;
esac

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
PRETTIER="$ROOT/node_modules/.bin/prettier"
[ -x "$PRETTIER" ] || exit 0
"$PRETTIER" --write --log-level=error "$FILE" >/dev/null 2>&1 || true
exit 0
