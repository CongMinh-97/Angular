#!/usr/bin/env bash
# PreToolUse (Bash): before Claude runs `git commit`, typecheck and format-check.
# Output is trimmed so a failure costs a few lines of context, not a full log.
source "$(dirname "$0")/_lib.sh"
INPUT=$(cat)
CMD=$(json_field "$INPUT" command)
printf '%s' "$CMD" | grep -qE '(^|[;&|[:space:]])git commit' || exit 0

ROOT="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$ROOT" || exit 0

STAGED=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|html|scss)$')
[ -z "$STAGED" ] && exit 0

if ! OUT=$(npx --no-install tsc -p tsconfig.app.json --noEmit 2>&1 && npx --no-install tsc -p tsconfig.spec.json --noEmit 2>&1); then
  block "$(printf 'Commit blocked: typecheck failed.\n%s' "$(printf '%s' "$OUT" | grep -E 'error TS' | head -8)")"
fi

# shellcheck disable=SC2086
if ! OUT=$(echo "$STAGED" | xargs npx --no-install prettier --check 2>&1); then
  block "$(printf 'Commit blocked: files not formatted. Run: npx prettier --write <files> && git add <files>\n%s' "$(printf '%s' "$OUT" | grep -F '[warn]' | head -10)")"
fi
exit 0
