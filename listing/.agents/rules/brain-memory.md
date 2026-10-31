# Automatic Brain & Team Memory Directive

This rule governs all work across the `Parmar-properties-listing` repository.

## Rule 1: Always Consult Brain Before Coding
Before proposing or executing code changes:
1. Inspect `brain/PROJECT_STATE.md` to understand current architecture and mock vs. live state.
2. Read the latest entries in `brain/TEAM_LOG.md` to see recent commits and handovers.
3. Check `brain/TASK_BOARD.md` for active tasks.

## Rule 2: Automatic Brain Updates Upon Completion
Whenever you complete code edits, bug fixes, or wiring tasks:
1. Directly edit `brain/TEAM_LOG.md` and insert an activity entry at the top of the stream.
2. Update `brain/TASK_BOARD.md` marking completed tasks or claiming in-progress items.
3. If new dependencies, configurations, or schemas were altered, update `brain/PROJECT_STATE.md` and `brain/ARCHITECTURE_MAP.md`.
4. Never leave the `brain/` folder stale.
