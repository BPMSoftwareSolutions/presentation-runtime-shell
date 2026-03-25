# Operator Experience Implementation Guide

**For:** IEP Scheduling Demo Restructuring  
**Goal:** Transform 17 scenes → 8 streamlined, operator-driven scenes  
**Principle:** *Molly takes 3 actions; system handles everything else*

---

## A. Current → Proposed Scene Mapping (Quick Reference)

```
CURRENT STRUCTURE          →    PROPOSED STRUCTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━→━━━━━━━━━━━━━━━━━━━━━━━

01-title                   →    Scene 1: Welcome
02-problem                 ┐    Scene 1: Welcome Setup
02-students                ┘
03-workflow                →    Scene 2: Workflow Context (optional)

07-grouping                →    Scene 3: Generate Groups ✅
08-schedule                →    Scene 4: Build Schedule ✅

04-disruption              ┐    Scene 5: Add New Student ✅
09-disruption              ┘
04-shift                   —    DELETE (unclear)
05-rebalance               ┐    Scene 6: Auto-Rebalance
10-rebalance               ┘
05-students                —    MERGE into Scene 6

06-compare                 ┐    Scene 7: Before vs After
11-before-after            ┘
06-structure               —    DELETE (unclear)

12-impact                  →    Scene 8: Close
```

---

## B. The 3 Operator Actions (Only These)

### Action 1️⃣: Generate Groups
```
Scene:    Scene 3
Button:   [ Generate Groups ]
System:   • Analyzes students
          • Organizes into groups
          • Shows rationale
Result:   Grouped view appears with next-button visibility
Duration: ~6 seconds
```

### Action 2️⃣: Build Weekly Schedule
```
Scene:    Scene 4
Button:   [ Build Weekly Schedule ]
System:   • Creates calendar grid
          • Satisfies all constraints
          • Detects/avoids conflicts
Result:   Fully scheduled week appears
Duration: ~7 seconds
```

### Action 3️⃣: Add Student (Minimal Form)
```
Scene:    Scene 5
Input:    Four fields only:
          • Name
          • Grade
          • Minutes / Week
          • Can group? (Yes/No)
System:   • Auto-triggers rebalance
          • No separate "Rebalance" button needed
Result:   Scene 6 (rebalance happens automatically)
Duration: ~4 seconds
```

---

## C. Everything Else is Automatic (No Operator Clicks)

| Task | System Does | Operator Does |
|------|-------------|---------------|
| Rebalance after new student | ✅ Auto-animates | ❌ Nothing |
| Validate schedule conflicts | ✅ Silent check | ❌ Nothing |
| Update constraint logic | ✅ Background | ❌ Nothing |
| Explain the "why" | ✅ Narration | ❌ Nothing |
| Show before/after | ✅ Display | ❌ Nothing |
| Close the demo | ✅ Narration | ❌ Nothing |

---

## D. Scene-by-Scene Checklist

### Scene 1: Welcome & Setup (PASSIVE)
- [ ] Opens with calm intro
- [ ] Shows Molly's world: student roster
- [ ] Light constraints visible (not editable)
- [ ] Narration: "Let's build your schedule from the students you already support"
- [ ] Auto-advance to Scene 2 after 15–18 seconds
- [ ] **Operator Action:** NONE

### Scene 2: Current Workflow (OPTIONAL — Can Skip)
- [ ] Shows messy current process
- [ ] Illustrates "the problem"
- [ ] Duration: 8 seconds max
- [ ] Narrator: "Here's how it works now…"
- [ ] Auto-advance to Scene 3
- [ ] **Decision:** Keep or delete? (If removing, combine Scene 1 + 3)
- [ ] **Operator Action:** NONE

### Scene 3: Generate Groups (OPERATOR ACTION #1)
- [ ] Prominent button: `[ Generate Groups ]`
- [ ] Operator clicks
- [ ] Spinner/brief processing animation
- [ ] Groups appear side-by-side
- [ ] Narration explains: "I've organized students by support type and availability"
- [ ] Clear next-button to Scene 4
- [ ] **Duration:** ~6 seconds
- [ ] **Operator Action:** Click once ✅

### Scene 4: Build Schedule (OPERATOR ACTION #2)
- [ ] Prominent button: `[ Build Weekly Schedule ]`
- [ ] Operator clicks
- [ ] Spinner/brief processing animation
- [ ] Weekly calendar grid appears fully scheduled
- [ ] Validation indicators: "✓ No conflicts" "✓ All constraints met"
- [ ] Narration explains: "Here's your week with no scheduling conflicts"
- [ ] Clear next-button to Scene 5
- [ ] **Duration:** ~7 seconds
- [ ] **Operator Action:** Click once ✅

### Scene 5: Disruption Alert (OPERATOR ACTION #3 — Setup Phase)
- [ ] Alert banner appears: "🚨 New Student Added"
- [ ] Student card shows: Name, Grade, Minutes/Week, Support Type
- [ ] Small form (4 fields) or click to confirm
- [ ] Narration: "A new enrollment requires schedule adjustment"
- [ ] System message: "New constraint detected. Rebalancing required."
- [ ] **NO** explicit "Rebalance" button — system will do it automatically
- [ ] Auto-advances to Scene 6 after operator inputs
- [ ] **Duration:** ~4 seconds (plus form entry time)
- [ ] **Operator Action:** Fill 4-field form ✅

### Scene 6: Rebalance (AUTOMATIC — System Handles)
- [ ] New student appears in groups (highlight/glow effect)
- [ ] Schedule grid animates updates to affected rows
- [ ] Constraints still satisfied (shown visually)
- [ ] Narration: "I've rebalanced the schedule. Only these rows changed."
- [ ] Emphasized rows glow softly (2–3 seconds)
- [ ] Auto-advance to Scene 7
- [ ] **Duration:** ~4 seconds
- [ ] **Operator Action:** NONE (watch it happen)

### Scene 7: Before vs After (PASSIVE)
- [ ] Side-by-side comparison grid
- [ ] Left: "Manual (Chaos)" | Right: "AI-Assisted (Solution)"
- [ ] Show metrics: Time saved, conflicts avoided, constraints met
- [ ] Narration: "No full rebuild. No lost constraints. No starting over."
- [ ] Emotional beat: "This stays manageable, even when things change"
- [ ] Fade-in rows progressively (2 per second, ~8–10 seconds total)
- [ ] Auto-advance to Scene 8
- [ ] **Duration:** ~10 seconds
- [ ] **Operator Action:** NONE

### Scene 8: Close & Impact (PASSIVE)
- [ ] Final statement/call-to-action
- [ ] Narration: "This is the kind of relief busy educators need."
- [ ] Optional: "Ready to learn more?" or just end
- [ ] Calm fade or final visual
- [ ] **Duration:** ~5 seconds
- [ ] **Operator Action:** NONE

---

## E. Interaction Do's and Don'ts

### ✅ DO
- ✅ **Preload all student constraints** (no editing during demo)
- ✅ **Auto-advance between scenes** (or single light "Continue" button)
- ✅ **Show processing spinners** when system is "thinking"
- ✅ **Use color coding:** Green (groups), Cyan (schedule), Red (alerts), Amber (processing)
- ✅ **Highlight affected rows** when rebalancing
- ✅ **Narrate every action** (explain the "why")
- ✅ **Enforce 3-click maximum** for operator

### ❌ DON'T
- ❌ **No drag-and-drop** rearrangement (feels mechanical)
- ❌ **No student editing forms** (preload constraints and display-only)
- ❌ **No "Validate" button** (system does it silently)
- ❌ **No multiple confirmation dialogs** (one "Add" → system handles rest)
- ❌ **No loading screens** between scenes
- ❌ **No navigation menus** (linear flow only)
- ❌ **No "optional" features** (focus on the simple path)
- ❌ **No scrolling** required (fit everything in viewport)

---

## F. Implementation Priority (Do This Order)

### Phase 1️⃣: Consolidation & Cleanup
1. Identify which scene files to merge:
   - `scene-02-problem/` + `scene-02-students/` → consolidate to one HTML (Scene 1)
   - `scene-04-disruption/` vs `scene-09-disruption/` → pick best, archive other
   - `scene-05-rebalance/` vs `scene-10-rebalance/` → pick best, archive other
   - `scene-06-compare/` vs `scene-11-before-after/` → pick best, archive other

2. Delete/archive unclear scenes:
   - `scene-03-schedule/` (if duplicate)
   - `scene-04-shift/` (if unclear)
   - `scene-06-structure/` (if unclear)

3. Rename remaining scenes to `scene-01` through `scene-08`

### Phase 2️⃣: Interaction Validation
1. **Scene 3 (Generate Groups):**
   - Ensure button is prominent and centered
   - Add spinner during processing
   - Verify groups animate in on completion
   - Set auto-advance timer

2. **Scene 4 (Build Schedule):**
   - Ensure button is prominent and centered
   - Add spinner during processing
   - Verify schedule grid animates in
   - Add validation badges ("✓ No conflicts", etc.)
   - Set auto-advance timer

3. **Scene 5 (New Student):**
   - Create minimal form (4 fields)
   - Set auto-advance after submit

4. **Scene 6 (Rebalance):**
   - Verify automatic trigger (no button)
   - Animate affected rows (glow effect)
   - Set auto-advance timer

### Phase 3️⃣: Narration & Messaging
1. Write calm, reassuring narration for each scene
2. Test audio length matches animation timing
3. Verify tone matches "guided relief" (not "powerful tool")
4. Review for clarity: explain the "why" behind each action

### Phase 4️⃣: Pacing & Duration
1. **Scene 1:** Target 15–18 seconds
2. **Scene 2:** Target 8 seconds (or 0 if deleted)
3. **Scene 3:** Target 6 seconds after click
4. **Scene 4:** Target 7 seconds after click
5. **Scene 5:** Target 4 seconds (plus form entry)
6. **Scene 6:** Target 4 seconds (auto)
7. **Scene 7:** Target 10 seconds
8. **Scene 8:** Target 5 seconds
9. **TOTAL:** ~50–60 seconds for full demo

---

## G. Testing Checklist (Before Launch)

### Operator Experience
- [ ] Demo flows without pausing between scenes
- [ ] Operator never wonders "what should I click?"
- [ ] Only 3 operator actions (Generate, Build, Add)
- [ ] Rebalance happens automatically (no extra button)
- [ ] New student scenario feels manageable (not alarming)

### Visual Flow
- [ ] All content fits in viewport (no scrolling)
- [ ] Animations are smooth and appropriate duration (2–3 sec max each)
- [ ] No loading screens or blank states
- [ ] Color coding is consistent across scenes
- [ ] No UI clutter or competing elements

### Narration & Messaging
- [ ] Tone is calm and reassuring throughout
- [ ] Every action is explained (show the "why")
- [ ] Emotional beats land: problem → relief → confidence → capability
- [ ] Audio syncs with visual animations
- [ ] Final close statement reinforces "this is easier than before"

### Pacing
- [ ] Total demo is 50–60 seconds
- [ ] No scene feels rushed or slow
- [ ] Operator has time to see results before next scene
- [ ] Demo can be replayed without boredom (concise!)

### Accessibility
- [ ] Color-blind friendly (don't rely only on color)
- [ ] Button text is clear and action-oriented
- [ ] Font sizes readable at display resolution
- [ ] Audio can be disabled if needed

---

## H. Exact Button Text (Copy This)

```
Scene 3:    [ Generate Groups ]
Scene 4:    [ Build Weekly Schedule ]
Scene 5:    [ Add to Schedule ] (or just form submit)
Scene 6:    (No button — automatic)
```

---

## I. File Structure After Consolidation

```
src/generated/iep-scheduling/
├── scene-01-welcome/          (MERGED: former 01-title + 02-problem + 02-students)
│   └── index.html
├── scene-02-workflow/          (optional: former 03-workflow)
│   └── index.html
├── scene-03-grouping/          (KEEP: former 07-grouping)
│   └── index.html
├── scene-04-schedule/          (KEEP: former 08-schedule)
│   └── index.html
├── scene-05-disruption/        (MERGED: best of 04-disruption + 09-disruption)
│   └── index.html
├── scene-06-rebalance/         (MERGED: best of 05-rebalance + 10-rebalance)
│   └── index.html
├── scene-07-compare/           (MERGED: best of 06-compare + 11-before-after)
│   └── index.html
└── scene-08-impact/            (KEEP: former 12-impact)
    └── index.html
```

---

## J. Key Principle to Remember

> **Molly is not navigating slides.  
> She is **triggering decisions in a system.**  
> Every interaction should feel like her judgment is being respected and the system is doing the hard work.**

---

## Summary

| Element | Status | Notes |
|---------|--------|-------|
| **Scenes** | 17 → 8 | Consolidate & renumber |
| **Operator Clicks** | 3 max | Generate, Build, Add |
| **System Automation** | 100% else | Rebalance, scheduling, validation |
| **Duration** | 50–60s | Brisk, memorable |
| **Tone** | Calm relief | "This is easier than what I do now" |
| **Pacing** | No bottlenecks | Auto-advance, no loading screens |

---

**Next Step:** Pick the phase (1–4 above) and start with the scene files that will be consolidated.
