#!/usr/bin/env bash
# PreToolUse (Edit|Write|MultiEdit): keep Claude out of generated, secret and applied-migration files.
source "$(dirname "$0")/_lib.sh"
INPUT=$(cat)
FILE=$(json_field "$INPUT" file_path)
[ -z "$FILE" ] && exit 0

case "$FILE" in
  */bin/*|*/obj/*|*/TestResults/*|*.Designer.cs|*ModelSnapshot.cs|*packages.lock.json)
    block "Blocked: $FILE is generated. Change the source, or regenerate it with the dotnet tool." ;;
  *appsettings.Production.json|*secrets.json|*.env|*.env.*|*.pfx|*.pem)
    block "Blocked: $FILE may hold secrets or production config. Ask the user to edit it." ;;
esac

# Committed migrations are immutable. Editing a migration created in this change is fine.
case "$FILE" in
  */Migrations/*.cs)
    if [ -f "$FILE" ] && git -C "$(dirname "$FILE")" ls-files --error-unmatch "$FILE" >/dev/null 2>&1; then
      block "Blocked: $FILE is a committed migration. Add a new migration instead of editing it."
    fi ;;
esac
exit 0
