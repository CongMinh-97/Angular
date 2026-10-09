---
name: bug-fix
description: Reproduce-first bug fixing workflow for this Angular project - capture the symptom, find the root cause, write a failing regression spec, apply the minimal fix, verify. Use for any bug report, regression, console error or failing behaviour.
---

# Bug fix workflow

Follow these steps in order. Do not skip step 3.

1. **Understand**: restate the bug as expected vs actual, with the route or component and steps to reproduce. If the report is vague, check the obvious entry points (route → component → service) before asking.
2. **Locate**: Grep the error text or symbol. For a broad search, use the `Explore` subagent, or the `debugger` agent for a messy failure. Read only the relevant ranges.
3. **Reproduce in a spec**: write the smallest spec that fails because of the bug, in the existing spec file if there is one. Run only it and confirm it fails for the right reason. If the bug cannot be unit-tested (pure layout or CSS), write down the manual repro steps instead.
4. **Root cause**: explain in 1-3 sentences why it happens (file:line). Fix the cause, not the symptom. Check the known traps in `.claude/agents/debugger.md`.
5. **Fix**: make the minimal change. No refactors or unrelated cleanups in the same change.
6. **Verify**: the regression spec passes, the specs of the touched folder pass, and `npm run typecheck` is clean. For UI bugs, also say how to check it in the browser.
7. **Report** with `templates/bug-report.md`, then suggest `/review` and `/commit`.
