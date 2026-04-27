# Loga Time-Centered Operator UX Spec

## North Star

Loga is not a dashboard wall. Loga is a live operator surface over AI Engine reality.

The operator should always understand:

1. What is happening now
2. How long it has been happening
3. What changed recently
4. What is expected next
5. What evidence proves the state

The primary UX promise is:

> The operator never has to scroll to find what is alive.

## Core Principle

> Time is the primary dimension. Everything else is a projection.

AI Engine already owns durable operational truth through SQL-backed workflow runs, project roadmaps, codebase shape, governance state, evidence, and operator projections. Loga should use that truth to produce a time-bound, focus-centered interface.

## Experience Model

### Wrong Model

```text
Project list
  scroll
    Workflow list
      scroll
        Details
          scroll
            Evidence
```

This creates stale, document-like UX.

### Right Model

```text
Focus -> Drill -> Replace -> Focus -> Drill -> Replace
```

Every click narrows the operator's attention. The screen replaces itself with the next focused lens instead of stacking content below.

## Screen Rule

Every operator screen has one center of gravity:

> What is alive in this time scope?

The default time scope is `Now`.

## Time Scopes

Loga should expose time as a first-class control:

| Scope | Meaning |
|---|---|
| Now | Active or latest authoritative system state |
| Last 5 minutes | Very recent activity, useful for live verification |
| Last hour | Current working window |
| Today | Daily operational picture |
| This week | Broader planning and review picture |
| Custom | Optional later, for audits and review sessions |

Changing the time scope reorients the whole operator surface.

## Operator Home

The operator home should not start with a long list. It should start with the most alive items.

```text
+------------------------------------------------+
| Time Scope: Now                                |
|------------------------------------------------|
| LIVE NOW                                       |
|------------------------------------------------|
| Workflow: Resume Generator                     |
| Step: Synthesizing tailored narrative          |
| Time in state: 12m 14s                         |
| Last activity: 38s ago                         |
| Next closure: Draft resume artifact ready      |
|                                                |
| [Open Workflow] [Open Project] [Evidence]      |
+------------------------------------------------+

+------------------------------------------------+
| RECENT SIGNALS                                 |
|------------------------------------------------|
| Codebase shape sync completed 2m ago           |
| Audio render completed 4m ago                  |
| Project roadmap item advanced 7m ago           |
+------------------------------------------------+
```

## Project Focus View

Opening a project replaces the screen and centers the project’s active state.

```text
Project: Resume Generator
Time Scope: Now

Current Stage: Narrative synthesis
Active Item: Generate tailored resume narrative
Time in active item: 12m 14s
Last activity: 38s ago
Expected next closure: Formatted resume draft ready for review

[Animated Workflow Playback Canvas]

Next:
- Format document
- Quality review

Future:
- Export final artifact
- Publish packet
```

The active item should pulse or breathe. The timer should tick.

## Implementation Plan Focus View

Opening an implementation plan should not show the whole roadmap first. It should show the active item first.

```text
Implementation Plan: Resume Generator

ACTIVE ITEM
Generate tailored resume narrative
Status: Running
Entered: 2026-04-26 14:02:00
Time in state: 12m 14s
Staleness posture: Healthy
Next closure: Draft generated and evidence linked

Upcoming Items
- Format resume artifact
- Run quality checks
- Prepare export

Completed Today
- Intake resume data
- Parse source profile
```

The full roadmap is available, but it is intentionally secondary.

## Workflow Playback View

Each workflow run becomes playable.

```text
Intake ✓ -> Parse ✓ -> Synthesize ● ticking -> Format ○ -> Review ○
                          12m 14s
```

Playback modes:

| Mode | Purpose |
|---|---|
| Live | Tracks current execution |
| Replay | Replays completed execution |
| Step | Advances one step at a time |
| Diff | Compares planned vs actual |
| Evidence | Opens proof for selected beat |

## No Scroll Rule

The operator should not scroll to find:

- active project
- active workflow
- active roadmap item
- current step
- time in state
- latest activity
- next expected closure

Scrolling is acceptable only inside secondary evidence drawers, historical lists, and raw payload panels.

## Drill-Down Interaction

Every click should either:

1. Replace the current lens with a more focused lens
2. Open a bounded drawer for evidence
3. Change the time scope

Never append major content below the fold.

## Visual Hierarchy

```text
Active / Now: centered, animated, ticking
Next: visible, secondary, static
Future: collapsed or intentionally opened
Past: available through time scope, not dominant
Raw evidence: drawer, not primary screen
```

## Trust Rules

1. Never show a status without showing when it became true.
2. Never show a project without showing last activity.
3. Never show an active workflow without time in state.
4. Never show a blocked/stale state without explaining why it is considered stale.
5. Never force the operator to scroll to discover the current state.
6. Always distinguish live truth from historical projection.

## Design Language

The system should feel alive but not noisy.

Use:

- ticking timers
- subtle pulse for active item
- animated step progression
- small “last activity” freshness indicators
- clean evidence drawers
- full-screen drill transitions

Avoid:

- giant scroll pages
- permanent multi-column clutter
- static stale lists
- JSON-first screens
- controls scattered across the page

## Product Phrase

> Loga is the perception layer for AI Engine reality-in-motion.
