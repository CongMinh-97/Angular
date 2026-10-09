#!/usr/bin/env bash
# PostToolUse (Edit|Write|MultiEdit): warn Claude (non-blocking) when a written file looks like it holds a secret.
source "$(dirname "$0")/_lib.sh"
INPUT=$(cat)
FILE=$(json_field "$INPUT" file_path)
[ -z "$FILE" ] || [ ! -f "$FILE" ] && exit 0
case "$FILE" in
  */tests/*|*.md|*/vendor/*|*.env.example) exit 0 ;;
esac

HITS=$(grep -niE \
  -e '(api[_-]?key|secret|access[_-]?token|client[_-]?secret|password)["'"'"']?[[:space:]]*(=>|=|:)[[:space:]]*["'"'"'][A-Za-z0-9_\-\.!@#%]{10,}["'"'"']' \
  -e 'AKIA[0-9A-Z]{16}' \
  -e 'sk_live_[A-Za-z0-9]{10,}' \
  -e 'BEGIN [A-Z ]*PRIVATE KEY' \
  "$FILE" 2>/dev/null | grep -vE "env\(|config\(" | head -3 | cut -c1-120)

if [ -n "$HITS" ]; then
  MSG=$(printf 'Possible secret in %s:\n%s\nRead it from .env via config() instead; do not commit it.' "$FILE" "$HITS" | sed 's/\\/\\\\/g; s/"/\\"/g' | awk '{printf "%s\\n", $0}')
  printf '{"hookSpecificOutput":{"hookEventName":"PostToolUse","additionalContext":"%s"}}' "$MSG"
fi
exit 0
