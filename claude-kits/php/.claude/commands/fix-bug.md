---
description: Fix a bug reproduce-first - failing test, root cause, minimal fix, verify
argument-hint: <symptom, exception or issue link>
---

Bug: $ARGUMENTS

Recent commits: !`git log --oneline -8`

Follow the `bug-fix` skill exactly. For a messy failure (stack trace, build break, intermittent), hand the investigation to the `debugger` agent and work from its report. Do not touch unrelated code.
