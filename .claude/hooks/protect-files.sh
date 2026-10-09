#!/usr/bin/env bash
# PreToolUse (Edit|Write|MultiEdit): keep Claude out of generated and secret files.
source "$(dirname "$0")/_lib.sh"
INPUT=$(cat)
FILE=$(json_field "$INPUT" file_path)
[ -z "$FILE" ] && exit 0

case "$FILE" in
  *package-lock.json|*yarn.lock|*pnpm-lock.yaml)
    block "Blocked: lockfiles are generated. Run npm install <pkg> instead of editing $FILE." ;;
  */node_modules/*|*/dist/*|*/.angular/*|*/coverage/*)
    block "Blocked: $FILE is generated or vendored. Change the source instead." ;;
  *.env|*.env.*|*/.env*)
    block "Blocked: $FILE may hold secrets. Ask the user to edit it." ;;
esac
exit 0
