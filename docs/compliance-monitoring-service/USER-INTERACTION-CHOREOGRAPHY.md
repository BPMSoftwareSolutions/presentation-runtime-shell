# User Interaction Choreography for 10-Scene Demo

This document defines cursor movements, clicks, button presses, and visual feedback for each scene, creating the illusion that a real user is operating the system.

---

## Global Interaction System

All scenes will use a shared interaction visualization layer:

- **Cursor Dot**: 8px cyan circle (#00D9FF) with shadow, follows mouse path
- **Click Ripple**: 40px expanding ring from click point, fades over 400ms
- **Button Press**: Momentary scale (0.95x) + shadow reduction
- **Hover Highlight**: Box-shadow glow on interactive elements
- **Focus Ring**: 2px cyan outline on focused form fields
- **Text Selection**: Blue highlight background on selected text
- **Scroll Indicator**: Right-side progress bar showing page scroll position

---

## Scene 01: Operations Dashboard — "Signal Recognition"

**Goal**: User discovers that a compliance signal has triggered and starts investigating.

**Interaction Sequence**:

1. **Cursor Entry** (0s)
   - Cursor appears at center-right of screen
   - Moves right → left across KPI strip, pausing 500ms on each metric
   - Narration: "Every signal flows through the system"

2. **KPI Inspection** (1.5s)
   - Hover over `.kpi-card` elements one by one
   - Hover highlight activates (cyan box-shadow glow)
   - Counts animate: 0→3, 0→2, 0→1, 0→4
   - Narration: "These are today's operational metrics"

3. **Alert Discovery** (3.5s)
   - Cursor moves to first `.alert-item` in alert panel
   - Hovers for 800ms
   - Alert item background pulse animates
   - Red compliance badge highlights
   - Narration: "A compliance signal has been triggered"

4. **Signal Acknowledgment** (4.5s)
   - Cursor moves to `.alert-action-button` (Investigate button)
   - Button hover highlight activates
   - Click action fires (ripple + scale 0.95)
   - Button text: "Investigate" → momentary press effect
   - Narration: "The system needs context..."

5. **Intelligence Moment** (5.5s)
   - Cursor path: Alert → KPI → Alert (triangulation motion)
   - All three focus regions pulse simultaneously
   - Semi-transparent "Signal → Context → Intelligence → Action" text appears as overlay
   - Narration: "Signal, Context, Intelligence, Action. That's the chain."

**Interactive Elements**:
- `.kpi-card`: Hover states
- `.alert-item`: Color pulse, highlight
- `.alert-action-button`: Click ripple, press effect
- `.kpi-red` badge: Glow animation

**Cursor Path Visualization**:
```
[KPI-1] ←→ [KPI-2] ←→ [KPI-3] ←→ [KPI-4]
                  ↓
            [ALERT-ITEM]
                  ↓
          [INVESTIGATE-BTN]
```

---

## Scene 02: Customer Detail — "Context Investigation"

**Goal**: User navigates customer history and compliance timeline to understand the context behind the signal.

**Interaction Sequence**:

1. **Timeline Scroll** (0s)
   - Cursor appears at left side of `.compliance-timeline`
   - Scroll wheel animation: page scrolls down 300px
   - Scroll indicator on right edge shows position
   - Narration: "Let's look at the history"

2. **Tab Navigation** (1.5s)
   - Cursor moves to `.tab-nav` buttons
   - Hovers over "Compliance" tab: highlight activates
   - Click action fires (ripple + fade to new content)
   - Tab content fades in showing compliance events
   - Narration: "Compliance events tell a story"

3. **Timeline Event Inspection** (3s)
   - Cursor moves down timeline, pausing on 3-4 key events
   - Hover glow activates on each `.timeline-event`
   - Small icons pulse (camera icons, document icons)
   - Narration: "Each encounter leaves a trace"

4. **Document Hover** (4.5s)
   - Cursor hovers over `.document-link` or `.attachment-icon`
   - Tooltip appears near cursor
   - Document icon scales up slightly
   - Narration: "Previous investigations created records"

5. **Status Card Focus** (5.5s)
   - Cursor moves to top `.status-card`
   - Glow effect activates
   - Card background subtly shifts color
   - Narration: "This context is now connected to the current alert"

**Interactive Elements**:
- `.tab-nav` buttons: Click ripple, content fade
- `.timeline-event`: Hover glow, icon pulse
- `.document-link`: Tooltip on hover, cursor change to pointer
- `.status-card`: Glow on hover
- Scroll wheel: Page scroll animation

**Cursor Path**:
```
[START] → [TAB-NAV] → [TIMELINE-EVENTS] ↓↓↓ → [DOCUMENT-ICON] → [STATUS-CARD]
```

---

## Scene 03: New Customer Onboarding — "System Setup Intelligence"

**Goal**: User sees system auto-fill and live-preview features, demonstrating how data flows through the system automatically.

**Interaction Sequence**:

1. **Form Field Auto-Fill** (0s)
   - Cursor appears at first `.form-field`
   - Focus ring (2px cyan outline) activates
   - Text appears character-by-character in field (typewriter effect, 50ms per char)
   - Cursor blinks in field
   - Narration: "New customer data enters the system"

2. **Multi-Field Cascade** (1.5s)
   - Cursor moves to next 2-3 form fields
   - Each field auto-fills in sequence with 300ms stagger
   - Focus ring moves down the form
   - Narration: "The system fills in what it knows"

3. **Live Preview Update** (3s)
   - Cursor moves to `.preview-panel` on right side
   - Preview content fades in and updates as form fills
   - Document icon appears, morphs to show "Customer_Profile.pdf"
   - Text content updates live: "Recent Activity: 0 → 1 → 2 → 3 records"
   - Narration: "Here's the customer's profile as it's built"

4. **Field Validation** (4.5s)
   - Cursor moves to `.submit-button`
   - All form fields show green checkmarks (fade in from right)
   - Checkmarks pulse once
   - Button hover highlight activates
   - Narration: "All required fields are complete"

5. **Submit Click** (5.5s)
   - Cursor clicks `.submit-button`
   - Button press effect (scale 0.95, shadow reduction)
   - Ripple emanates from button center
   - Page stagger-fades (bottom → top) as if transitioning away
   - Narration: "The customer profile is ready for the next step"

**Interactive Elements**:
- `.form-field`: Focus ring, text cursor, typewriter text
- `.preview-panel`: Live content updates, icon morphing
- `.form-validation-mark`: Fade in from right with pulse
- `.submit-button`: Hover glow, click ripple, press effect

**Cursor Path**:
```
[FIELD-1] → [FIELD-2] → [FIELD-3] → [PREVIEW-PANEL] → [SUBMIT-BTN] ✓
```

---

## Scene 04: Service Visit Report — "Field Capture Intelligence"

**Goal**: User demonstrates how a technician uses the system in the field to capture checklist items and attach photos.

**Interaction Sequence**:

1. **Checklist Walkthrough** (0s)
   - Cursor appears at top of `.checklist-section`
   - Moves down, stopping at each `.checklist-item`
   - Narration: "The technician walks through each step"

2. **Checkbox Clicks** (1.5s)
   - Cursor clicks first 3-4 `.checkbox` elements in sequence
   - Each click: ripple effect + box animation (slides right to checked state)
   - Checkmark icon fades in
   - Stagger between clicks: 400ms
   - Item row background color shifts to light green
   - Narration: "Capture what they observe"

3. **Photo Attachment** (4s)
   - Cursor moves to `.attach-photo-button`
   - Button hover highlight activates
   - Click action fires (ripple + scale 0.95)
   - Placeholder image fades in: `.photo-thumbnail`
   - Narration: "Evidence is attached automatically"

4. **Photo Gallery** (5s)
   - Cursor moves between 2-3 `.photo-thumbnail` items
   - Hover: image scales up 1.1x, glow activates
   - Small camera icon pulses in corner of each
   - Narration: "Multiple angles captured, multiple perspectives documented"

5. **Completion Summary** (6s)
   - Cursor moves to `.completion-badge` at top right
   - Badge pulses with checkmark animation
   - Progress bar shows 100% fill (animates left → right)
   - Narration: "Complete and ready to submit"

**Interactive Elements**:
- `.checkbox`: Click ripple, slide animation, checkmark fade-in
- `.checklist-item`: Row background color shift
- `.attach-photo-button`: Hover glow, click ripple
- `.photo-thumbnail`: Hover scale 1.1x, icon pulse
- `.completion-badge`: Pulse animation, glow
- `.progress-bar`: Left-to-right fill animation

**Cursor Path**:
```
[CHECKLIST] → [ITEM-1] [ITEM-2] [ITEM-3] → [PHOTO-BTN] → [PHOTO-GALLERY] → [COMPLETION]
```

---

## Scene 05: Monitoring Alert Triage — "Live Signal Processing"

**Goal**: User demonstrates real-time alert filtering and triage, showing how the system prioritizes signals.

**Interaction Sequence**:

1. **Status Badge Animation** (0s)
   - Cursor appears at `.alert-status-badge`
   - Badge pulses with critical indicator animation
   - "CRITICAL" text fades in bright red
   - Small spinning icon in badge rotates 360° once
   - Narration: "New alert incoming. Critical priority."

2. **Filter Interaction** (1.5s)
   - Cursor moves to `.filter-control`
   - Hovers over "Priority: All" dropdown
   - Dropdown highlight activates
   - Click fires, dropdown slides open
   - Checkbox options appear with stagger
   - Narration: "Filter to the most urgent items"

3. **Filter Selection** (3s)
   - Cursor clicks "Critical" option
   - Checkmark appears next to option with ripple
   - Dropdown slides closed
   - Alert list re-filters: low-priority items fade out top
   - Only critical alerts remain, highlighted
   - Narration: "Show only what needs immediate attention"

4. **Signal Strength Visualization** (4.5s)
   - Cursor moves to `.signal-indicator` bars in alert rows
   - Bars animate: grow from left to right over 400ms
   - Height indicates signal strength
   - Colors shift: green → yellow → red based on value
   - Cursor pauses on strongest signal (highest bar)
   - Narration: "Signal strength shows severity"

5. **Action Button Cluster** (5.5s)
   - Cursor moves to `.action-button-group` in top alert
   - Hovers over each button (Acknowledge, Escalate, Resolve)
   - Each button hover: glow + highlight background
   - Narration: "Each alert ready for operator action"

**Interactive Elements**:
- `.alert-status-badge`: Pulse, spinning icon, text fade-in
- `.filter-control`: Dropdown slide open/close, option ripple
- `.signal-indicator`: Bars grow animation, color shift
- `.action-button-group`: Individual button hovers with glow

**Cursor Path**:
```
[BADGE] → [FILTER-BTN] → [DROPDOWN] → [CRITICAL-OPTION] → [SIGNAL-BARS] → [ACTION-BTNS]
```

---

## Scene 06: Compliance Tracker — "Risk Interpretation"

**Goal**: User navigates the compliance matrix, highlighting risk zones and understanding thresholds.

**Interaction Sequence**:

1. **Table Scan** (0s)
   - Cursor appears at top-left of `.compliance-table`
   - Moves across first row horizontally
   - Column headers glow as cursor passes (hover effect)
   - Narration: "These are the compliance domains we monitor"

2. **Row Inspection** (1.5s)
   - Cursor moves down first column `.domain-label` items
   - Each label highlights on hover with background glow
   - Row data fades in from left to right as cursor moves
   - Color coding becomes visible: green / yellow / red cells
   - Narration: "Each domain has current status"

3. **Threshold Focus** (3.5s)
   - Cursor moves to `.threshold-cell` with red status
   - Cell background pulses red with 2s cycle
   - Glow effect (red box-shadow) activates
   - Tooltip appears: "79% - Above threshold"
   - Narration: "This one exceeds safety limits"

4. **Trend Arrow Animation** (4.5s)
   - Cursor hovers over `.trend-indicator` (up/down arrow)
   - Arrow scales up 1.2x
   - Arrow color animates: red arrow pulses
   - Narration: "And it's getting worse"

5. **Risk Badge Highlight** (5.5s)
   - Cursor moves to `.risk-badge` (HIGH, MEDIUM, LOW)
   - Badges in at-risk rows glow with color-matched box-shadow
   - Text scales up 1.1x on hover
   - Multiple rows highlight indicating broad compliance risk
   - Narration: "Multiple domains are in the red zone"

**Interactive Elements**:
- `.table-header`: Glow on hover
- `.domain-label`: Highlight background on hover
- `.compliance-cell`: Row stagger fade-in, color coding
- `.threshold-cell`: Red pulse, glow, tooltip
- `.trend-indicator`: Scale 1.2x, color pulse
- `.risk-badge`: Box-shadow glow, text scale

**Cursor Path**:
```
[TABLE-HEADER] → [DOMAIN-ROWS] ↓ → [THRESHOLD-CELL] → [TREND-ARROW] → [RISK-BADGES]
```

---

## Scene 07: Load Bank Decision — "Decision Intelligence"

**Goal**: User reviews decision matrix and recommendations, making a selection based on system analysis.

**Interaction Sequence**:

1. **Decision Matrix Review** (0s)
   - Cursor appears at `.decision-matrix`
   - Moves across column headers left → right
   - Each header cell highlights with glow
   - Narration: "The system analyzes the options"

2. **Cost/Benefit Row Animation** (1.5s)
   - Cursor moves down `.option-row` items
   - Each row fades in from bottom with 300ms stagger
   - Data cells animate: numbers count up from 0
   - Cost numbers: $0 → $X (currency animation)
   - Benefit percentages: 0% → Y% (percentage bar grows)
   - Narration: "Each option has different tradeoffs"

3. **Recommendation Highlight** (3.5s)
   - Cursor moves to `.recommended-row` (usually the optimal choice)
   - Row background shifts to light cyan/highlight color
   - Green checkmark badge appears top-right with pulse
   - Glow effect (cyan box-shadow) activates around entire row
   - Narration: "This is the recommended path forward"

4. **Risk Indicator Check** (4.5s)
   - Cursor hovers over `.risk-meter` in columns
   - Meter bars animate: grow from left to right
   - Colors: green → yellow → orange → red based on risk level
   - Tooltips appear showing risk percentage
   - Narration: "Risks are quantified and transparent"

5. **Selection and Commit** (5.5s)
   - Cursor moves to `.select-button` of recommended row
   - Button glow activates (cyan highlight)
   - Click action fires: ripple + scale 0.95 + text blinks "SELECTED"
   - Row background animates to solid highlight
   - Narration: "Decision made. Now execute."

**Interactive Elements**:
- `.decision-matrix` headers: Glow on hover
- `.option-row`: Stagger fade-in, data count-up animations
- `.recommended-row`: Highlight background, glow, checkmark badge pulse
- `.risk-meter`: Bar growth animation, meter color shift
- `.select-button`: Hover glow, click ripple, press effect, text blink

**Cursor Path**:
```
[HEADERS] → [OPTION-ROWS] ↓ → [RECOMMENDED-ROW] → [RISK-METERS] → [SELECT-BTN]
```

---

## Scene 08: Monthly Report Generator — "Output Creation"

**Goal**: User configures report sections and watches the report assemble in a preview panel.

**Interaction Sequence**:

1. **Control Panel Interaction** (0s)
   - Cursor appears at `.controls-grid` on left side
   - Moves between `.section-checkbox` items (KPI Summary, Alerts, Financials, etc.)
   - Each checkbox shows hover highlight (glow background)
   - Narration: "Configure which sections to include"

2. **Checkbox Selections** (1.5s)
   - Cursor clicks 4-5 checkboxes in sequence
   - Each click: ripple effect + checkbox slides to checked state
   - Checkmark icon fades in
   - Stagger between clicks: 300ms
   - Checkbox label text gains color (shifts from gray to active color)
   - Narration: "Choose what to report"

3. **Live Preview Updates** (4s)
   - As each checkbox is checked, corresponding section appears in `.preview-panel` on right
   - Sections fade in from bottom with stagger
   - Section headers slide down from top
   - Content text and icons appear with animation
   - Page indicator updates: "Page 1 of 3" → "Page 1 of 5"
   - Narration: "The report builds in real-time"

4. **Page Preview Navigation** (5.5s)
   - Cursor moves to `.page-down-button` (pagination control)
   - Button click fires ripple + scale effect
   - Preview panel content slides left, new page slides in from right
   - Page indicator increments
   - Narration: "Multiple pages of context"

5. **Generate Button** (6.5s)
   - Cursor moves to `.generate-button`
   - Glow effect activates (cyan highlight)
   - Click action: ripple + scale 0.95 + button fills with progress bar
   - Bar animates left → right over 1.5s
   - Button text changes: "Generating..." with spinning icon
   - Narration: "Report assembly begins"

**Interactive Elements**:
- `.section-checkbox`: Hover glow, click ripple, checked animation
- `.checkbox-label`: Text color shift
- `.preview-panel`: Section fade-in, stagger, slide animations
- `.page-down-button`: Click ripple, scale effect
- `.generate-button`: Glow, click ripple, progress bar animation

**Cursor Path**:
```
[CHECKBOXES] → [CHECKBOX-CLICKS] ↓ → [PREVIEW-PANEL] → [PAGINATION] → [GENERATE-BTN]
```

---

## Scene 09: Annual Compliance Report — "Evidence Packaging"

**Goal**: User reviews a compliance packet, identifying missing documents and uploading them to complete the picture.

**Interaction Sequence**:

1. **Document List Scan** (0s)
   - Cursor appears at `.document-list`
   - Moves down through `.document-item` elements
   - Each item highlights on hover with glow effect
   - Document icons vary: checkmark (complete), warning (missing), alert (expired)
   - Narration: "Annual compliance requires comprehensive documentation"

2. **Missing Document Highlight** (1.5s)
   - Cursor moves to `.document-item` with `.missing` status
   - Item background shifts to light red/warning color
   - Warning icon pulses 2x
   - Red glow box-shadow activates
   - Tooltip appears: "Missing: Annual Audit Report"
   - Narration: "Some pieces are incomplete"

3. **Status Summary Update** (3s)
   - Cursor moves to `.completeness-meter` at top
   - Meter bar animates: grows from current % up to target %
   - Color shifts: red → yellow → green as % increases
   - Text updates: "45% Complete" → (animated counter) → "72% Complete"
   - Narration: "We need to close these gaps"

4. **Upload Button Interaction** (4.5s)
   - Cursor moves to `.upload-button` near missing documents
   - Button glow activates
   - Click action: ripple + scale effect
   - File input appears (or upload zone highlights)
   - Narration: "Upload the missing documents"

5. **Document Upload Animation** (5.5s)
   - Cursor hovers over uploaded file in `.file-preview`
   - File thumbnail fades in with glow
   - Document icon morphs to show file type
   - Check-mark badge appears top-right, pulses
   - Item moves from "missing" section to "complete" section with slide animation
   - Completeness meter updates: grows another 20%
   - Narration: "Each document closes the loop"

**Interactive Elements**:
- `.document-item`: Hover glow, status color coding
- `.missing-document-item`: Red glow, warning icon pulse, tooltip
- `.completeness-meter`: Bar growth animation, color shift, text count-up
- `.upload-button`: Hover glow, click ripple
- `.file-preview`: Fade-in with glow, icon morph, checkmark badge pulse
- Document item: Slide animation between sections

**Cursor Path**:
```
[DOCUMENT-LIST] → [MISSING-ITEM] → [COMPLETENESS-METER] → [UPLOAD-BTN] → [FILE-COMPLETE]
```

---

## Scene 10: Customer Portal — "Business Value Realization"

**Goal**: User sees customer-facing portal showing compliance status, KPIs, and recent activity—demonstrating the business value delivered.

**Interaction Sequence**:

1. **Status Hero Entrance** (0s)
   - Cursor appears at `.status-hero` section
   - Hero background animates in with fade + slide-down
   - Large compliance score number scales in: 0 → final % with ease-out
   - Color shifts: red starting point (0) through yellow/orange to green (final)
   - Status badge pulses with final state (e.g., "COMPLIANT")
   - Narration: "This is what the customer sees"

2. **KPI Grid Count-Up** (2s)
   - Cursor moves across `.kpi-grid` items
   - Each KPI value animates: 0 → final number using cubic easing
   - Stagger between KPIs: 150ms
   - Icons scale up 1.1x as numbers complete
   - Background color hints (green for positive, etc.)
   - Narration: "Their operational health at a glance"

3. **Recent Activity Scroll** (3.5s)
   - Cursor moves to `.recent-activity-section`
   - Activity items fade in from bottom with stagger (300ms between each)
   - Each item: timestamp, activity description, status icon
   - Activity icons pulse (checkmark, alert, info, etc.)
   - Narration: "All recent activity documented and visible"

4. **Document Download Links** (5s)
   - Cursor moves to `.document-links` or `.downloadable-items` section
   - Hovers over document items
   - Each link shows hover highlight with hand-pointer cursor
   - Download icon scales up 1.15x
   - Tooltip appears: "Click to download PDF"
   - Narration: "Complete audit trail available"

5. **Compliance Timeline** (6s)
   - Cursor moves down `.compliance-timeline`
   - Timeline events fade in from left with stagger
   - Green checkmarks appear next to completed compliance checks
   - Blue info icons appear next to recent activity
   - Red warning icons appear next to remediation items
   - Narration: "History shows the journey to compliance"

6. **Final Value Summary** (7s)
   - Cursor moves to `.value-badge` or `.impact-summary`
   - Badge pulses with glow effect
   - Text animates in: "Compliance Achieved", "Zero Critical Alerts", "100% Documentation"
   - All KPIs, icons, and timeline items pulse simultaneously once (finale)
   - Narration: "This is the business value: peace of mind"

**Interactive Elements**:
- `.status-hero`: Fade + slide-down background, number scale-in, color shift
- `.status-badge`: Pulse animation
- `.kpi-grid` items: Number count-up (cubic easing), icon scale 1.1x, stagger
- `.recent-activity-item`: Fade-in from bottom, stagger, icon pulse
- `.document-link`: Hover highlight, icon scale 1.15x, tooltip, hand cursor
- `.compliance-timeline` items: Fade-in from left, stagger, icon pulse
- `.value-badge`: Pulse glow, text fade-in, finale pulse sync

**Cursor Path**:
```
[STATUS-HERO] → [KPI-GRID] → [RECENT-ACTIVITY] → [DOCUMENT-LINKS] → [TIMELINE] → [VALUE-BADGE]
```

---

## Implementation Requirements

### CSS Cursor Layer
```css
#interaction-cursor {
  position: fixed;
  width: 8px;
  height: 8px;
  background: #00D9FF;
  border-radius: 50%;
  box-shadow: 0 0 12px #00D9FF33, 0 0 24px #00D9FF66;
  pointer-events: none;
  z-index: 10000;
}

#interaction-cursor.clicking {
  animation: cursor-click-ripple 0.4s ease-out forwards;
}

@keyframes cursor-click-ripple {
  0% {
    width: 8px;
    height: 8px;
    box-shadow: 0 0 0 0 #00D9FF99;
  }
  100% {
    width: 40px;
    height: 40px;
    box-shadow: 0 0 0 0 transparency;
  }
}
```

### JavaScript Cursor Tracking
- Smooth bezier-curve path interpolation (not linear)
- Velocity-based motion timing
- Click point detection and ripple firing
- Hover state management for interactive elements

### Animation Timing Coordination
- Global demo narration pacing (3-4s per step)
- Stagger delays between multi-element animations (150-300ms typical)
- Easing functions: `ease-out` for entrances, `cubic-bezier(0.34, 1.56, 0.64, 1)` for bouncy elements

---

## Scene Interaction Complexity Ranking

1. **Scene 01** ⭐ — Simple hover + click on 3-4 elements
2. **Scene 02** ⭐⭐ — Scroll + tab click + timeline hover chain
3. **Scene 03** ⭐⭐⭐ — Form field cascade with live preview sync
4. **Scene 04** ⭐⭐ — Checkbox sequence + photo hover
5. **Scene 05** ⭐⭐⭐ — Dropdown filter + live signal bar animation
6. **Scene 06** ⭐⭐ — Table scan + hover highlight + threshold glow
7. **Scene 07** ⭐⭐⭐⭐ — Matrix count-up + recommended highlight + selection
8. **Scene 08** ⭐⭐⭐ — Checkbox cascade + live preview sync + pagination
9. **Scene 09** ⭐⭐⭐⭐ — Missing doc highlight + meter animation + upload + section movement
10. **Scene 10** ⭐⭐⭐⭐ — Hero entrance + KPI count-up + timeline stagger + document hover

---

## Testing Checklist

- [ ] Cursor path follows smooth bezier curves (not jerky)
- [ ] Click ripples originate from exact cursor position
- [ ] Hover highlights activate on correct elements
- [ ] Narration timing synchronized with cursor actions
- [ ] Stagger delays feel natural (not too fast, not too slow)
- [ ] Visual feedback is distinct but not distracting
- [ ] All animations respect accessibility (can be disabled)
- [ ] Cursor visible at all times (sufficient contrast)
