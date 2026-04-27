# Loga ↔ AI Engine Time Projection Contract

## Purpose

This contract defines the data shape Loga needs from AI Engine to render a time-bound, alive operator surface.

The goal is to support:

1. Now-first operator views
2. Time-scoped project and workflow ordering
3. Active item focus
4. Workflow playback animation
5. Causal links between system activity and affected projects

## Core Query Pattern

All operator surfaces should accept a time scope.

```http
GET /api/loga/ai-engine/now?scope=now
GET /api/loga/ai-engine/activity?scope=last_5_minutes
GET /api/loga/ai-engine/projects?scope=today&orderBy=last_activity_at
GET /api/loga/ai-engine/workflows?scope=last_hour&orderBy=last_activity_at
```

## Time Scope Enum

```ts
export type OperatorTimeScope =
  | 'now'
  | 'last_5_minutes'
  | 'last_hour'
  | 'today'
  | 'this_week'
  | 'custom';
```

For `custom`, include `from` and `to`.

## Project Activity Projection

Every project card must be ordered by `last_activity_at` descending.

```ts
export interface ProjectActivityProjection {
  project_id: string;
  project_slug: string;
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
  current_owner?: string;
  next_expected_closure?: string;

  freshness_band: 'live' | 'recent' | 'today' | 'stale';
  staleness_reason?: string;

  evidence_refs: EvidenceRef[];
}
```

## Workflow Activity Projection

```ts
export interface WorkflowActivityProjection {
  workflow_id: string;
  workflow_slug: string;
  workflow_name: string;
  workflow_run_id: string;
  run_status: string;

  current_step_key?: string;
  current_step_title?: string;
  current_step_status?: string;
  current_step_entered_at?: string;
  current_step_time_in_state_ms?: number;

  last_activity_at: string;
  last_activity_type: string;
  last_activity_summary: string;

  expected_next_step_key?: string;
  expected_next_closure?: string;

  stale_after_ms?: number;
  staleness_band: 'healthy' | 'watch' | 'stale' | 'blocked';
  staleness_reason?: string;

  playback: WorkflowPlaybackProjection;
  evidence_refs: EvidenceRef[];
}
```

## Workflow Step Operator Narrative Contract

Each workflow step should carry human-facing meaning.

```ts
export interface WorkflowStepOperatorNarrative {
  step_key: string;
  operator_label: string;
  operator_intent: string;
  active_state_message: string;
  expected_duration_band: 'seconds' | 'minutes' | 'hours' | 'days' | 'unknown';
  stale_after_ms?: number;
  next_expected_closure: string;
  evidence_policy: 'required' | 'optional' | 'none';
}
```

Example:

```json
{
  "step_key": "render_audio_segments",
  "operator_label": "Rendering audio segments",
  "operator_intent": "Convert prepared text segments into audio artifacts.",
  "active_state_message": "We are rendering segment audio and waiting for artifact completion.",
  "expected_duration_band": "minutes",
  "stale_after_ms": 1800000,
  "next_expected_closure": "Audio artifacts are created and ready for quality checks.",
  "evidence_policy": "required"
}
```

## Workflow Playback Projection

```ts
export interface WorkflowPlaybackProjection {
  run_id: string;
  generated_at: string;
  current_beat_key?: string;
  movements: PlaybackMovement[];
}

export interface PlaybackMovement {
  movement_key: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'blocked' | 'skipped';
  started_at?: string;
  completed_at?: string;
  time_in_state_ms?: number;
  beats: PlaybackBeat[];
}

export interface PlaybackBeat {
  beat_key: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'blocked' | 'skipped';
  entered_at?: string;
  completed_at?: string;
  time_in_state_ms?: number;
  active_message?: string;
  closure_message?: string;
  evidence_refs: EvidenceRef[];
}
```

## Activity Event Projection

This is the foundation for the “what happened recently” feed.

```ts
export interface ActivityEventProjection {
  event_id: string;
  event_type: string;
  event_time: string;
  title: string;
  summary: string;

  source_kind: 'workflow' | 'project' | 'ci_cd' | 'codebase_shape' | 'governance' | 'audio_render' | 'retrieval' | 'system';
  source_id?: string;

  affected_entities: AffectedEntity[];
  evidence_refs: EvidenceRef[];
}

export interface AffectedEntity {
  entity_type: 'project' | 'workflow' | 'workflow_run' | 'code_file' | 'code_symbol' | 'roadmap_item' | 'artifact';
  entity_id: string;
  relationship: 'advanced' | 'updated' | 'blocked' | 'completed' | 'created' | 'impacted' | 'observed';
  summary?: string;
}
```

## Evidence Ref

```ts
export interface EvidenceRef {
  evidence_type: string;
  evidence_ref: string;
  title?: string;
  recorded_at?: string;
  source_table?: string;
  source_id?: string;
}
```

## Derived Fields

### `last_activity_at`

Compute from the latest meaningful timestamp across:

- active workflow run update
- step run activity
- roadmap item activity
- governance decision
- evidence link creation
- artifact creation
- codebase shape run affecting the project
- CI/CD sync event affecting the project

### `time_in_state_ms`

```text
time_in_state_ms = now_utc - current_state_entered_at
```

### `freshness_band`

Suggested defaults:

| Band | Rule |
|---|---|
| live | active now or activity within 5 minutes |
| recent | activity within 1 hour |
| today | activity since local day start |
| stale | no activity today or exceeded stale threshold |

### `staleness_band`

Suggested defaults:

| Band | Rule |
|---|---|
| healthy | time in state is below 50% stale threshold |
| watch | time in state is between 50% and 100% stale threshold |
| stale | time in state exceeds stale threshold |
| blocked | explicit blocked state or unresolved blocker |

## Causal Activity: Codebase Shape Sync

When CI/CD reshapes code files and symbols, Loga should display the sync as activity and connect it to affected projects when possible.

Example:

```json
{
  "event_type": "codebase_shape_sync_completed",
  "event_time": "2026-04-26T15:02:00Z",
  "title": "Codebase shape sync completed",
  "summary": "Files and symbols were refreshed from CI/CD into SQL-backed codebase memory.",
  "source_kind": "codebase_shape",
  "affected_entities": [
    {
      "entity_type": "project",
      "entity_id": "project-id",
      "relationship": "impacted",
      "summary": "Refactor candidates and symbol relationships may have changed."
    }
  ]
}
```

## API Response: Operator Now

```ts
export interface OperatorNowProjection {
  generated_at: string;
  time_scope: OperatorTimeScope;
  headline: string;

  live_workflows: WorkflowActivityProjection[];
  active_projects: ProjectActivityProjection[];
  recent_events: ActivityEventProjection[];

  system_freshness: {
    latest_workflow_activity_at?: string;
    latest_codebase_shape_activity_at?: string;
    latest_governance_activity_at?: string;
    latest_project_activity_at?: string;
  };
}
```

## UX Consumption Rules

1. Sort projects by `last_activity_at` descending.
2. Sort workflows by `last_activity_at` descending.
3. Show active items before future roadmap items.
4. Show future items only as secondary collapsed context.
5. Use `time_in_state_ms` for ticking timers.
6. Use `staleness_band` for visual posture.
7. Use evidence refs to open bounded drawers.
8. Never require raw JSON inspection to understand current state.

## Implementation Priority

1. Add `last_activity_at` projection for projects and workflows.
2. Add operator narrative metadata to workflow steps.
3. Add active item projection to roadmap detail responses.
4. Add playback projection from workflow runs and step runs.
5. Add activity event feed with affected entities.
6. Add causal linkage from codebase shape sync to impacted projects.
