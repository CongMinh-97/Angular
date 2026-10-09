#!/usr/bin/env bash
# PostToolUse (Edit|Write|MultiEdit): warn Claude (non-blocking) when a written file looks like it holds a secret.
source "$(dirname "$0")/_lib.sh"
INPUT=$(cat)
FILE=$(json_field "$INPUT" file_path)
[ -z "$FILE" ] || [ ! -f "$FILE" ] && exit 0
case "$FILE" in
  *.spec.ts|*/mock-backend/*|*/testing/*|*.md|*/node_modules/*) exit 0 ;;
esac

HITS=$(grep -niE \
  -e '(api[_-]?key|secret|access[_-]?token|client[_-]?secret)["'"'"']?[[:space:]]*[:=][[:space:]]*["'"'"'][A-Za-z0-9_\-]{12,}' \
  -e 'AKIA[0-9A-Z]{16}' \
  -e 'BEGIN [A-Z ]*PRIVATE KEY' \
  -e 'eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.' \
  "$FILE" 2>/dev/null | head -3 | cut -c1-120)

if [ -n "$HITS" ]; then
  MSG=$(printf 'Possible secret in %s:\n%s\nMove it to environment config or a server-side secret; do not commit it.' "$FILE" "$HITS" | sed 's/\\/\\\\/g; s/"/\\"/g' | awk '{printf "%s\\n", $0}')
  printf '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"%s"}}' "$MSG"
fi
exit 0
