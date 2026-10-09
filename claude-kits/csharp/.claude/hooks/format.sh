#!/usr/bin/env bash
# PostToolUse (Edit|Write|MultiEdit): format the changed C# file.
# Uses CSharpier when installed (fast, per file): dotnet tool install -g csharpier  (or a local tool manifest).
# Without it nothing happens here; the pre-commit hook still runs `dotnet format --verify-no-changes`.
source "$(dirname "$0")/_lib.sh"
INPUT=$(cat)
FILE=$(json_field "$INPUT" file_path)
[ -z "$FILE" ] || [ ! -f "$FILE" ] && exit 0
case "$FILE" in
  */bin/*|*/obj/*) exit 0 ;;
  *.cs) ;;
  *) exit 0 ;;
esac

if command -v csharpier >/dev/null 2>&1; then
  csharpier format "$FILE" >/dev/null 2>&1 || csharpier "$FILE" >/dev/null 2>&1 || true
elif dotnet csharpier --version >/dev/null 2>&1; then
  dotnet csharpier format "$FILE" >/dev/null 2>&1 || dotnet csharpier "$FILE" >/dev/null 2>&1 || true
fi
exit 0
