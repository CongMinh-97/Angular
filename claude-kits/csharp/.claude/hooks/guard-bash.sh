#!/usr/bin/env bash
# PreToolUse (Bash): block destructive or token-wasting shell commands.
source "$(dirname "$0")/_lib.sh"
INPUT=$(cat)
CMD=$(json_field "$INPUT" command)
[ -z "$CMD" ] && exit 0

# Only match where a command starts (line start, ; & | ( or $( ), so text inside strings or heredocs is less likely to trip it.
AT='(^|[;&|(]|\$\()[[:space:]]*(sudo[[:space:]]+)?'
has() { printf '%s' "$CMD" | grep -qE "$1"; }

if has "${AT}rm[[:space:]]+(-[a-zA-Z]+[[:space:]]+)*-[a-zA-Z]*[rR][a-zA-Z]*[[:space:]]+(-[a-zA-Z]+[[:space:]]+)*(/|~|~/|\*|\.|\./|\\\$HOME/?)([[:space:];&|]|$)"; then
  block "Blocked: recursive delete of a root, home or whole working directory. Delete specific paths instead."
fi
if has "${AT}git[[:space:]]+push[^;&|]*[[:space:]](--force|-f)([[:space:]]|$)"; then
  block "Blocked: force push. Use --force-with-lease on your own branch, and only if the user asked for it."
fi
if has "${AT}git[[:space:]]+push[^;&|]*[[:space:]](origin[[:space:]]+)?(HEAD:)?(main|master|develop)([[:space:]]|$)"; then
  block "Blocked: direct push to a protected branch. Push a feature branch and open a PR."
fi
if has "${AT}git[[:space:]]+(reset[[:space:]]+--hard|clean[[:space:]]+-[a-zA-Z]*f|checkout[[:space:]]+--[[:space:]]+\.|restore[[:space:]]+\.)"; then
  block "Blocked: this discards uncommitted work. Ask the user first, or stash."
fi
if has "${AT}git[[:space:]]+commit[^;&|]*--no-verify"; then
  block "Blocked: --no-verify skips the checks. Fix the reported problem instead."
fi
# Database safety: these change or destroy a real database.
if has "${AT}dotnet[[:space:]]+ef[[:space:]]+(database[[:space:]]+(drop|update)|migrations[[:space:]]+remove)"; then
  block "Blocked: database-changing EF command. Ask the user to run it, and say which connection string it targets."
fi
# Token savers: generated files are huge and useless in context.
if has "${AT}(cat|less|more|head|tail)[[:space:]][^;&|]*(/bin/|/obj/|\.Designer\.cs|ModelSnapshot\.cs|packages\.lock\.json)"; then
  block "Blocked: generated file, too large for context. Grep for the specific symbol instead."
fi
exit 0
