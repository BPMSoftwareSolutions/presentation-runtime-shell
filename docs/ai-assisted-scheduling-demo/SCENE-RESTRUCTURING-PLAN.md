# IEP Scheduling Demo — Scene Restructuring Plan

## Executive Summary

**Current State:** 17 scenes with overlapping/duplicate numbering (scene-02-problem, scene-02-students, etc.)
**Target State:** 8-scene operator-driven flow per design principles
**Key Goal:** Molly (operator) takes only 3–4 actions; system handles everything else

---

## A. Current 17-Scene Inventory

### Problem/Setup Phase
| Scene | Title | Duration | Current Role | Analysis |
|-------|-------|----------|--------------|----------|
| 01 | scene-01-title | Welcome | Passive | ✅ **Keep** — Calm opening |
| 02a | scene-02-problem | Problem statement | Passive | ⚠️ **Consolidate** — Context for pain |
| 02b | scene-02-students | Student roster view | Passive | ⚠️ **Consolidate** — Part of setup |
| 03a | scene-03-schedule | Schedule view (unclear) | Passive | 🗑️ **Review** — Duplicate or unclear purpose |
| 03b | scene-03-workflow | Current workflow | Passive | ⚠️ **Consolidate** — Establishes "the inefficiency" |

### Action Phase 1: Grouping
| Scene | Title | Duration | Current Role | Analysis |
|-------|-------|----------|--------------|----------|
| 07 | scene-07-grouping | Grouping suggestion | Operator clickable | ✅ **Keep** — First operator action |

### Action Phase 2: Scheduling
| Scene | Title | Duration | Current Role | Analysis |
|-------|-------|----------|--------------|----------|
| 08 | scene-08-schedule | Schedule draft | Operator clickable | ✅ **Keep** — Second operator action |

### Action Phase 3: Disruption & Rebalance
| Scene | Title | Duration | Current Role | Analysis |
|-------|-------|----------|--------------|----------|
| 04a | scene-04-disruption | New student alert | Operator clickable | ⚠️ **Consolidate** — Third action |
| 04b | scene-04-shift | Shift/move operation | System animation | 🗑️ **Clarify** — Overlaps with rebalance |
| 05a | scene-05-rebalance | Rebalancing process | System automatic | ⚠️ **Consolidate** — Part of disruption chain |
| 05b | scene-05-students | Updated students | System display | 🗑️ **Merge** — Viewing after action |
| 09 | scene-09-disruption | Disruption (repeat) | Operator/system | 🗑️ **Clarify** — Duplicate scenario |
| 10 | scene-10-rebalance | Rebalance (repeat) | System automatic | 🗑️ **Clarify** — Duplicate scenario |

### Closing Phase
| Scene | Title | Duration | Current Role | Analysis |
|-------|-------|----------|--------------|----------|
| 06a | scene-06-compare | Before vs after | Passive | ⚠️ **Keep** — Part of outcome |
| 06b | scene-06-structure | Structure view | Passive | 🗑️ **Unclear** — Duplicate or unneeded |
| 11 | scene-11-before-after | Before vs after | Passive | ⚠️ **Consolidate** — Same as 06a |
| 12 | scene-12-impact | Impact/close | Passive | ✅ **Keep** — Emotional close |

---

## B. Proposed 8-Scene Operator-Driven Flow

### 🎭 Scene 1: Welcome & Setup (RAPID)
**Purpose:** Quick recognition of Molly's world — then move to action
**Combine:** scene-01-title + scene-02-problem + scene-02-students (condensed)
**Operator Action:** None
**System Action:** 
- AI intro (single line): "Let's build your schedule from the students you already support"
- Preloaded student roster (visual only, small cards, no editing)
- No problem explanation or workflow diagram
**Narration Style:** One sentence. Warm. Immediate.
**Interaction Model:** Passive viewing — no clicks
**Duration:** **8–10 seconds (NOT 15–18)**
**Output Feeling:** "Okay, yeah. Let's do this."
**Why:** Molly already knows her problem. Drive toward value fast.

---

### 🗑️ Scene 2: DELETED
**Reason:** Molly does not need to be convinced she has a problem. Demo loses "effortless" feel. Intro → Grouping (no detour).
**Impact:** Runtime shrinks. Pacing tightens. Magic accelerates.

---

### ✅ Scene 3: Generate Groups (OPERATOR ACTION #1)
**Purpose:** First operator decision point
**Source:** scene-07-grouping
**Operator Action:** Click `[ Generate Groups ]`
**System Action:**
- AI analyzes students
- Groups appear with visual organization
- Shows constraint alignment
**Narration:** "Let me group these students intelligently…"
**Transition:** Animated reveal of groups
**Output Feeling:** "Okay, that's already useful."
**Keep Exactly As:** Yes — this is working

---

### 📅 Scene 4: Build Weekly Schedule (OPERATOR ACTION #2)
**Purpose:** Second operator decision point
**Source:** scene-08-schedule
**Operator Action:** Click `[ Build Weekly Schedule ]`
**System Action:**
- Calendar grid appears fully scheduled
- Constraints satisfied
- Conflicts avoided
**Narration:** "Now I'll create the weekly schedule…"
**Transition:** Schedule grid animates in with validation indicators
**Output Feeling:** "Oh, that saved time."
**Keep Exactly As:** Yes — this is working

---

### 🔴 Scene 5: Quick-Add (OPERATOR ACTION #3)
**Purpose:** Show system handles disruption with zero friction
**Combine:** scene-04-disruption + scene-09-disruption (pick best one)
**Operator Action:** Click `[ Add to Schedule ]` (NOT a form)
**System Action:**
- Quick-add context (feels like confirmation, not data entry):
  * Student name: Mason
  * Grade: 3
  * Minutes: 120/week
  * Can group: YES
- No form fields. No editing. Display-only.
- One button: `[ Add to Schedule ]`
**Narration:** "A new enrollment just came in. Mason, Grade 3, 120 minutes a week."
**Transition:** Alert banner + student card (minimal, confirmation-style)
**Duration:** ~3–4 seconds
**Output Feeling:** "Okay, I just told the system. Now what?"
**Key:** This feels like *agreeing to let the system help*, not *filling out paperwork*

---

### 🔄 Scene 6: Auto-Rebalance (🔥 HERO MOMENT)
**Purpose:** This is WHERE MOLLY BELIEVES. System adapts without friction.
**Combine:** scene-05-rebalance + scene-10-rebalance (pick best automation visuals)
**Operator Action:** None
**System Action:** 3-beat sequence (choreographed timing):

**Beat 1 — Detect (1–1.5 sec):**
- System message: "New constraint detected…"
- Spinner or processing indicator (brief)
- Narration: "I'm adjusting the schedule…"

**Beat 2 — Adjust & Reveal (3–4 sec):**
- Schedule grid animates
- Affected rows shift/update (visual emphasis)
- Mason slides into Group A
- Constraints light up as satisfied
- Narration: "I've adjusted everything so it still works."

**Beat 3 — Confirm Safe (1–2 sec):**
- Glow settles
- Final message: "Schedule updated. No conflicts introduced."
- Narration: "It's done. No starting over."

**Total Duration:** **6–8 seconds (NOT 4)**
**Why:** This is the emotional payoff. Slow it down so Molly *sees* the magic.
**Output Feeling:** "Wait… it just solved that for me?"
**Narration Tone:** "Here's what I'm taking care of for you" (care language, not capability)

---

### 📊 Scene 7: Outcome (Relief, Not Metrics)
**Purpose:** Emotional validation — show what was saved
**Combine:** scene-06-compare + scene-11-before-after (consolidate to one best version)
**Operator Action:** None
**System Action:**
- Side-by-side comparison (minimal design):
  * Left: "Manual" (chaos visual, crossed-out steps)
  * Right: "AI-Assisted" (clean, organized)
- Focus on 3 things ONLY (not dashboards):
  * ✓ No rebuild
  * ✓ No conflicts
  * ✓ No stress
**Narration:** "No starting over. No conflicts. No guesswork."
**Duration:** ~8–10 seconds
**Transition:** Rows fade in side-by-side
**Output Feeling:** "This stays manageable, even when things change."
**Key:** Less "metrics dashboard", more "relief dashboard"

---

### 🎬 Scene 8: Close & Impact
**Purpose:** Emotional endpoint — the sale
**Source:** scene-12-impact (+ wrap-up narration)
**Operator Action:** None
**System Action:** Final statement/call-to-action
**Narration:** "This is the kind of relief busy educators need."
**Transition:** Calm fade or final visual
**Output Feeling:** "I'm ready to use this."

---

## C. Scene Consolidation & Elimination Matrix

| Current Scenes | Action | New Scene | Rationale |
|---|---|---|---|
| 01-title | **Keep** | Scene 1 | Calm welcome |
| 02-problem + 02-students | **Merge** | Scene 1 | Context + roster |
| 03-workflow | **Keep** | Scene 2 (optional) | Establishes inefficiency contrast |
| 03-schedule | **Review** | See Note | Unclear if this duplicates or adds value — need to inspect content |
| 04-disruption + 09-disruption | **Merge** | Scene 5 | Pick best version for new student alert |
| 04-shift | **Clarify** | See Note | Overlaps with rebalance — possibly remove |
| 05-rebalance + 10-rebalance | **Merge** | Scene 6 | Auto-rebalance visualization |
| 05-students | **Merge** | Scene 6 | Updated roster view after rebalance |
| 06-structure | **Review/Remove** | — | Unclear purpose — likely redundant |
| 06-compare + 11-before-after | **Merge** | Scene 7 | Before/after comparison |
| 07-grouping | **Keep** | Scene 3 | First operator action |
| 08-schedule | **Keep** | Scene 4 | Second operator action |
| 12-impact | **Keep** | Scene 8 | Final emotional close |

---

## D. Interaction Validation

### ✅ Operator Actions (Limited to 3–4)
1. **Generate Groups** — Scene 3 click
2. **Build Weekly Schedule** — Scene 4 click
3. **Add Student** — Scene 5 click (+ minimal 4-field form)
4. **[Optional] Rebalance** — Recommend automatic; remove explicit button

### ❌ System Handles (Auto, No Clicking)
- Grouping logic
- Schedule generation
- Conflict detection
- Rebalancing after new student
- Explanation/narration

### 🚫 Avoid
- Manual drag-and-drop rearrangement
- "Edit student" form (preload constraints)
- "Validate schedule" step (automatic)
- Multiple confirmation dialogs
- Navigation menus (linear flow only)

---

## E. Specific Restructuring Recommendations

### For Scene 01-Title
- **Current OK:** Yes, keep as-is
- **Minor Enhancement:** Ensure narration sets up the "guided relief" feeling immediately

### For Scene 02-Problem + Scene 02-Students
- **Recommendation:** Merge into one cohesive "setup" scene
- **Flow:**
  1. Topbar intro with problem summary
  2. Two-column layout: left = student roster, right = pain points
  3. Light constraints badges on student cards (no editing)
  4. Clear transition button or auto-advance to Scene 3
- **Operator Interaction:** None
- **Avoid:** No form fields, no student card expansion, no editing

### For Scene 03-Workflow (Optional)
- **Decision:** Keep or remove?
  - **Keep if:** It directly contrasts inefficiency with upcoming solution (5–10 seconds max)
  - **Remove if:** Molly already knows the problem; move straight to grouping
- **If Kept:** Condense to show current messy workflow flow diagram, then immediate transition

### For Scene 07-Grouping (Generate Groups)
- **Keep Exactly:** This scene is well-designed
- **Validation:**
  - Operator clicks `[ Generate Groups ]`
  - AI processes (show spinner briefly)
  - Groups appear side-by-side with visual organization
  - Narration explains WHY (constraint alignment, grouping logic)
  - Auto-advance or light "Continue" button to Scene 4

### For Scene 08-Schedule (Build Schedule)
- **Keep Exactly:** This scene is well-designed
- **Validation:**
  - Operator clicks `[ Build Weekly Schedule ]`
  - Schedule grid appears fully formed
  - Show validation indicators (e.g., "✓ No conflicts", "✓ All constraints met")
  - Narration explains the schedule
  - Auto-advance or light "Continue" button to Scene 5

### For Scene 04-Disruption + Scene 09-Disruption
- **Recommendation:** Pick the BEST version or merge them
- **What We Need:**
  - Alert banner: "New student added — rebalancing required"
  - Student card with 4 fields visible: Name, Grade, Minutes, Support Type
  - System message: "New constraint detected. Rebalancing…"
- **Operator Interaction:** 
  - Option A: Just displays (system automation visible)
  - Option B: Operator clicks `[ Add to Schedule ]` to trigger rebalance
- **Decision:** Go with Option A (automatic) for minimum clicks

### For Scene 05-Rebalance + Scene 10-Rebalance
- **Recommendation:** Consolidate to ONE scene showing rebalance animation
- **What Must Happen:**
  - New student appears in groups (with highlight/glow)
  - Schedule grid updates (affected rows glow)
  - Constraints remain satisfied
  - Narration: "Rebalancing complete. Only those rows changed."
- **Timing:** ~2–3 seconds of animation, then auto-advance to Scene 7

### For Scene 06-Compare + Scene 11-Before-After
- **Recommendation:** Keep ONE consolidated version
- **What We Need:**
  - Side-by-side: "Manual Chaos" vs. "AI-Assisted"
  - Key metrics: time saved, conflicts avoided, constraints met
  - Calm closing statement
  - Narration ties it together

### For Scene 12-Impact (Close)
- **Keep Exactly:** This is the emotional endpoint
- **Validation:** 
  - Reinforces the benefit ("This stays manageable")
  - Shows confidence in ongoing use
  - Optional: CTA or transition (depending on demo context)

---

## F. Recommended HTML/File Changes

### Phase 1: Consolidation (No New Features)
```
Delete or Archive:
- scene-03-schedule/ (if duplicating scene-08-schedule)
- scene-04-shift/ (if duplicate of rebalance logic)
- scene-06-structure/ (if unclear purpose)

Rename/Reorganize:
- scene-02-problem/ → scene-02-setup/ (merge with scene-02-students)
- scene-04-disruption/ → scene-05-disruption/ (renumber to new flow)
- scene-05-rebalance/ → scene-06-rebalance/ (renumber)
- scene-06-compare/ → scene-07-compare/ (renumber)
- scene-12-impact/ → scene-08-impact/ (renumber)
```

### Phase 2: Updated Scene Numbering
```
New Final Structure:
- scene-01-title/
- scene-02-setup/ (or scene-02-workflow, if keeping context)
- scene-03-grouping/ (Generate Groups)
- scene-04-schedule/ (Build Schedule)
- scene-05-disruption/ (New Student)
- scene-06-rebalance/ (Auto-Rebalance)
- scene-07-compare/ (Before vs After)
- scene-08-impact/ (Close)
```

### Phase 3: Interaction Updates
**For each action scene (03, 04, 05), ensure:**
- Prominent, centered button with action text
- Hover/active states that feel responsive
- Spinner or progress indicator during "processing"
- Clear narration of what happened
- Auto-advance or subtle "Continue" cue (don't require another click)

---

## G. Operator Experience Rules (Implementation Checklist)

### ✅ For Every Scene, Ask:
1. **Does Molly need to decide or act here?**
   - Yes → Give her 1 clear action max
   - No → Make it passive/automatic

2. **Is there a form, dialog, or extra step?**
   - Yes → Remove it or move it off-screen
   - Preload constraints, use smart defaults

3. **Does this introduce complexity?**
   - Yes → Delete it or automate it
   - No → Good, keep it

### ✅ Interaction Rules
- **3 operator buttons ONLY** (Generate, Build, Add to Schedule)
- **NO "Next" or "Continue" buttons** (everything else auto-advances)
- **Rebalance is automatic** (zero operator input)
- **No drag-and-drop** (feels mechanical)
- **No form fields** (display-only data)
- **No "validation" step** (automatic)
- **No navigation menus** (linear flow only)
- **No modal dialogs** (full-screen flow)

### ✅ Pacing Rules (TIGHTENED)
- **Scene 1:** 8–10 seconds (setup, roster only — no problem explanation)
- **Scene 3:** 5–6 seconds (grouping appears)
- **Scene 4:** 6–7 seconds (schedule appears)
- **Scene 5:** 3–4 seconds (quick-add — no form)
- **Scene 6 (🔥):** 6–8 seconds (rebalance — SLOW THIS DOWN, it's the hero moment)
- **Scene 7:** 8–10 seconds (relief outcome, not metrics dashboard)
- **Scene 8:** 4–5 seconds (close)
- **Total Demo:** **45–55 seconds** (tight, replayable)

### ✅ Narration Rules (CARE LANGUAGE)
- **Calm, confident voice** (not "look how powerful")
- **Use care language, not capability language:**
  * ❌ "I've grouped your students" → ✅ "I've taken care of grouping based on their needs"
  * ❌ "I've rebalanced" → ✅ "I've adjusted everything so it still works"
  * ❌ "Here's what I did" → ✅ "Here's what I'm taking care of for you"
- **Explain the why:** "Groups based on support type and availability"
- **Acknowledge change:** "New constraint detected. I'm adjusting…"
- **Reassure:** "No full rebuild. No conflicts. No stress."
- **Close with benefit:** "This stays manageable, even when things change."

### ✅ Visual Rules
- **Preload everything possible** (no loading screens mid-action)
- **Animated reveals** (feel responsive, not jarring)
- **Color coding:** Green (groups), cyan (schedule), red (alerts), amber (processing)
- **Glows/highlights** for emphasis (affected rows, new students)
- **No scrolling** (fit content in viewport)
- **No modals** (full-screen or drawers only)

---

## H. Testing Checklist (Before Finalization)

- [ ] **Scene 1:** Molly feels "this is my world"
- [ ] **Scene 3:** Molly clicks once → groups appear → feels relief
- [ ] **Scene 4:** Molly clicks once → schedule appears → feels saved time
- [ ] **Scene 5:** New student alert doesn't feel alarming (just informational)
- [ ] **Scene 6:** Rebalance happens automatically (no extra clicks)
- [ ] **Scene 7:** Comparison clearly shows "before chaos" vs "after calm"
- [ ] **Scene 8:** Molly walks away feeling "I can use this"
- [ ] **No operator confusion:** She never wonders "what should I click?"
- [ ] **Pacing:** Not rushed, not slow (50–60 seconds total)
- [ ] **Narration clarity:** Every action is explained, not assumed

---

## I. Final Consolidated Scene Map

| # | Scene Key | Title | Operator Action | System Action | Duration | Feel |
|---|---|---|---|---|---|---|
| 1 | scene-01-welcome | Welcome & Quick Setup | None | Show roster (no problem explanation) | **8–10s** | "Let's go" |
| 2 | —DELETED— | (No workflow context) | — | — | **0s** | (Removed) |
| 3 | scene-03-grouping | Generate Groups | **Click button** | Groups appear | 6s | "That's already useful" |
| 4 | scene-04-schedule | Build Schedule | **Click button** | Schedule appears | 7s | "Oh, that saved time" |
| 5 | scene-05-disruption | Add to Schedule | **Click button** (quick-add, no form) | System acknowledges | 3–4s | "Let the system handle it" |
| 6 | scene-06-rebalance | Rebalance (🔥 HERO) | None | Schedule adapts (3-beat choreography) | **6–8s** ⬆️ | "It just solved that?" |
| 7 | scene-07-compare | Outcome (Relief) | None | Show relief, not metrics | **8–10s** | "This is manageable" |
| 8 | scene-08-impact | Close & Summary | None | Final narration | 5s | "I'm ready to use this" |
| **TOTAL** | — | — | **3 clicks** | **All else automatic** | **~45–55s** ⬇️ | **Effortless magic** |

---

## Summary & Next Steps

1. **Consolidate duplicate scenes** (02-problem + 02-students into one)
2. **Renumber scenes 1–8** per recommended flow
3. **Remove/archive unclear scenes** (03-schedule, 04-shift, 06-structure)
4. **Add interaction validation** (ensure only 3 operator actions)
5. **Review narration** (calm, explanatory, reassuring tone)
6. **Test pacing** (target 50–60 seconds total)
7. **Verify automation** (system handles grouping, scheduling, rebalancing)

---

**Design Principle:** Molly is not navigating slides. She is **triggering decisions in a system**. Every interaction should feel like her judgment is being respected and the system is doing the hard work.
