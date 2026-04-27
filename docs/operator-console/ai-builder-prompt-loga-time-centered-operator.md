# AI Builder Prompt: Implement Loga Time-Centered Operator Surface

You are working on the Loga web app and its AI Engine integration.

Your task is to implement a time-centered, focus-driven operator experience. Do not build a long scrolling dashboard. Build an alive operator surface that centers the current active system state.

## Product Intent

Loga is the perception layer for AI Engine reality-in-motion.

The operator must immediately understand:

1. What is happening now
2. How long it has been in that state
3. What changed recently
4. What is expected next
5. What evidence proves the state

## Non-Negotiable UX Rules

1. No long scrolling project dashboard.
2. Do not append drill-down content below the current page.
3. Clicking a project, workflow, roadmap item, or implementation plan replaces the current focus view.
4. Active state is centered and visually dominant.
5. Future roadmap items are visible only as secondary context or behind intentional interaction.
6. Past events are accessed through time scope, not shown by default as clutter.
7. Every status must show when it became true.
8. Every active item must show time in state.
9. Every project/workflow list must sort by last activity descending.
10. Raw JSON belongs in evidence drawers, not as the primary view.

## Required Time Scopes

Implement a time scope selector with:

- Now
- Last 5 minutes
- Last hour
- Today
- This week

Changing the time scope should reorient the whole operator surface.

## Operator Home Target Layout

The default home should show:

1. Time scope selector
2. Live Now section
3. Active projects sorted by last activity
4. Recent signals for the selected time scope
5. No giant scroll list

Example layout:

```text
TIME SCOPE: Now

LIVE NOW
Workflow: Resume Generator
Step: Synthesizing tailored narrative
Time in state: 12m 14s
Last activity: 38s ago
Next closure: Draft resume artifact ready for review

[Open Workflow] [Open Project] [Evidence]

RECENT SIGNALS
- Codebase shape sync completed 2m ago
- Audio render completed 4m ago
- Roadmap item advanced 7m ago
```

## Project Focus View

When a project is opened, replace the operator home with a project focus view.

Show:

- project name
- current stage
- active roadmap item
- active workflow if any
- time in active state
- last activity
- next expected closure
- workflow playback preview
- upcoming items as secondary context
- evidence drawer trigger

Do not show the full roadmap as the primary content.

## Workflow Focus View

When a workflow is opened, show:

- workflow name
- run status
- current step
- step operator message
- entered at
- time in state ticking live
- expected next closure
- playback timeline
- evidence drawer trigger

Playback should eventually animate, but first implementation can use a static/ticking stepper.

## Data Shape To Expect or Create

Add or consume projections shaped like:

```ts
interface ProjectActivityProjection {
  project_id: string;
  project_name: string;
  project_status: string;
  last_activity_at: string;
  last_activity_type: string;
  last_activity_summary: string;
  active_workflow_run_id?: string;
  active_item_key?: string;
  active_item_title?: string;
  active_item_status?: string;
  active_item_entered_at?: string;
  active_item_time_in_state_ms?: number;
  current_stage?: string;
  next_expected_closure?: string;
  freshness_band: 'live' | 'recent' | 'today' | 'stale';
}
```

```ts
interface WorkflowActivityProjection {
  workflow_id: string;
  workflow_name: string;
  workflow_run_id: string;
  run_status: string;
  current_step_key?: string;
  current_step_title?: string;
  current_step_status?: string;
  current_step_entered_at?: string;
  current_step_time_in_state_ms?: number;
  last_activity_at: string;
  last_activity_summary: string;
  expected_next_closure?: string;
  staleness_band: 'healthy' | 'watch' | 'stale' | 'blocked';
}
```

```ts
interface ActivityEventProjection {
  event_id: string;
  event_type: string;
  event_time: string;
  title: string;
  summary: string;
  source_kind: 'workflow' | 'project' | 'ci_cd' | 'codebase_shape' | 'governance' | 'audio_render' | 'retrieval' | 'system';
  affected_entities: Array<{
    entity_type: string;
    entity_id: string;
    relationship: string;
    summary?: string;
  }>;
}
```

## Implementation Approach

### Phase 1: Frontend Focus Model

- Add operator time scope selector.
- Add focus-state navigation model: home -> project -> workflow -> evidence.
- Replace page stacking with focused view replacement.
- Add ticking timers for active states.
- Sort project/workflow cards by `last_activity_at` descending.

### Phase 2: API Projection Layer

- Add or update Loga proxy endpoints under `/api/loga/ai-engine/*` to request time-scoped projections.
- If AI Engine does not yet expose a perfect projection, compose the best available fields server-side.
- Keep secrets server-side.
- Do not expose API keys in browser code.

### Phase 3: Workflow Playback

- Build a first version of workflow playback as a stepper.
- Current step pulses.
- Completed steps show completed state.
- Future steps are static.
- Evidence drawer opens from any step.

### Phase 4: Causal Activity

- Represent codebase shape sync as a time event.
- Display latest code shape sync in recent signals.
- Later, connect affected files/symbols to affected projects.

## Component Suggestions

Use component boundaries like:

- `OperatorTimeScopeSelector`
- `OperatorNowSurface`
- `LiveNowCard`
- `ProjectActivityCard`
- `ProjectFocusView`
- `WorkflowFocusView`
- `WorkflowPlaybackStepper`
- `ActivitySignalList`
- `EvidenceDrawer`
- `TimeInStateTicker`

## Acceptance Criteria

The implementation passes if:

1. Operator home defaults to `Now`.
2. Projects are ordered by last activity, not alphabetically.
3. Opening a project replaces the current view instead of scrolling down.
4. Opening a workflow replaces the current view instead of scrolling down.
5. Active item is centered and visually dominant.
6. Time in state ticks while viewing active state.
7. Future roadmap items are visible but secondary.
8. Evidence appears in drawers, not as primary clutter.
9. The operator can switch to Last 5 minutes, Last hour, Today, and This week.
10. No API secret is exposed to the browser.

## Design Tone

Make the system feel alive, calm, and trustworthy.

Use subtle animation, clear time labels, and focused drill-downs.

Avoid dashboard clutter, giant lists, infinite scroll, and JSON-first UI.
