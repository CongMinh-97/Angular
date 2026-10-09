#!/usr/bin/env bash
# PreToolUse (Bash): before Claude runs `git commit`, lint, format-check and analyse the staged PHP files.
# Output is trimmed so a failure costs a few lines of context, not a full log.
source "$(dirname "$0")/_lib.sh"
INPUT=$(cat)
CMD=$(json_field "$INPUT" command)
printf '%s' "$CMD" | grep -qE '(^|[;&|(][[:space:]]*)git[[:space:]]+commit' || exit 0

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}" || exit 0
STAGED=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.php$')
[ -z "$STAGED" ] && exit 0

for f in $STAGED; do
  OUT=$(php -l "$f" 2>&1) || block "$(printf 'Commit blocked: syntax error.\n%s' "$(printf '%s' "$OUT" | head -3)")"
done

if [ -x vendor/bin/pint ]; then
  # shellcheck disable=SC2086
  OUT=$(vendor/bin/pint --test $STAGED 2>&1) || block "$(printf 'Commit blocked: style. Run: vendor/bin/pint <files> && git add <files>\n%s' "$(printf '%s' "$OUT" | grep -E '⨯|FAIL|\.php' | head -8)")"
fi

if [ -x vendor/bin/phpstan ]; then
  # shellcheck disable=SC2086
  OUT=$(vendor/bin/phpstan analyse --no-progress --error-format=raw --memory-limit=1G $STAGED 2>&1) || block "$(printf 'Commit blocked: PHPStan.\n%s' "$(printf '%s' "$OUT" | head -8)")"
fi
exit 0
