#!/usr/bin/env bash
# PreToolUse (Bash): before Claude runs `git commit`, build (warnings as errors) and check formatting.
# Output is trimmed so a failure costs a few lines of context, not a full log.
source "$(dirname "$0")/_lib.sh"
INPUT=$(cat)
CMD=$(json_field "$INPUT" command)
printf '%s' "$CMD" | grep -qE '(^|[;&|(][[:space:]]*)git[[:space:]]+commit' || exit 0

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}" || exit 0
git diff --cached --name-only --diff-filter=ACM | grep -qE '\.(cs|csproj|props)$' || exit 0

if ! OUT=$(dotnet build -warnaserror -v q -nologo 2>&1); then
  block "$(printf 'Commit blocked: build failed.\n%s' "$(printf '%s' "$OUT" | grep -E ': (error|warning) ' | sort -u | head -8)")"
fi
if ! OUT=$(dotnet format --verify-no-changes --no-restore -v q 2>&1); then
  block "$(printf 'Commit blocked: formatting. Run: dotnet format\n%s' "$(printf '%s' "$OUT" | head -8)")"
fi
exit 0
