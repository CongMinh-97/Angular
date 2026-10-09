---
description: Fix a bug reproduce-first - failing spec, root cause, minimal fix, verify
argument-hint: <symptom, error message or issue link>
---

Bug: $ARGUMENTS

Recent commits (possible regressions): !`git log --oneline -8`

Follow the `bug-fix` skill exactly: locate → failing regression spec → root cause → minimal fix → verify → report with its template.
For a messy failure (stack trace, failing build, flaky behaviour), hand the investigation to the `debugger` agent and work from its report.
Do not refactor or touch unrelated code in this change.
