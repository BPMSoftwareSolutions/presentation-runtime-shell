Since we want the **full HTML visible in every scene**, and we **do not want the demo layer to reinterpret or editorialize the product**, the right direction is:

# Demo principle

The demo should feel like a **premium camera operator over a real product**, not an AI presenter.

That means:

* **The HTML is always the hero**
* Motion comes from **framing**, not synthetic narration
* The engine can **zoom, pan, scroll, pause, and focus**
* Each screen should feel like a **live operating surface**
* The sequence should reveal **how a real operator would work through the system**
* No “AI explains what we mean” layer on top

This aligns well with the app direction already established: an internal operations-first system spanning dashboard, customer records, onboarding, service logging, monitoring, compliance, load-bank decisions, reports, and a later customer portal . It also fits the runtime idea we already have: scene-by-scene sequencing, scripted interactions, and controlled progression across 10 screens .

---

# Global guidance for all 10 HTML screens

## What the demo should feel like

Think:

* **high-trust**
* **operational**
* **intentional**
* **calm but sharp**
* **dense, but legible**
* **cinematic without becoming theatrical**

Not:

* splashy
* over-animated
* voice-of-God AI
* fake-autonomous
* “look what the assistant thinks”

The product already has visual depth and density in the existing Operations Dashboard and Customer Detail screens, with dark glass UI, strong card hierarchy, KPI bands, detailed panels, and rich internal workflows  .

---

## Camera rules for every scene

The presentation engine should behave like a **film camera over software**.

### Default state

Start every scene with the **entire HTML fully visible** for orientation.

### Then move in this pattern

1. **Full-screen establish**
2. **One deliberate zoom or crop**
3. **Optional second focus move**
4. **Return to wider framing if needed**
5. **Advance**

### Motion style

* Slow, confident easing
* No jittery hopping between hotspots
* No rapid punch-ins
* No excessive parallax
* Use scroll only when the page truly extends below the fold

### Timing

* Hold the full page long enough for recognition
* Let each zoom land and breathe
* Favor **2–3 meaningful camera moves** per screen, not 8–10

---

## Interaction rules

The UI can animate, but the demo should not feel like it is “performing tricks.”

Use:

* hover states
* row selection
* tab switching
* filters opening
* progress reveal
* slight number count-up
* active chip / selected row states
* realistic cursor movement if the engine supports it

Avoid:

* simulated typing everywhere
* gratuitous modal spam
* “AI thoughts” panels
* synthetic toast storms
* narration boxes that cover the product

---

## Focus behavior

The engine should highlight with restraint.

Preferred focus tools:

* zoom
* slight vignette around the focal area
* gentle spotlight
* paused dwell on the target region

Avoid:

* bright pulsing boxes everywhere
* giant arrows
* loud annotations
* big floating explainer cards

---

## Content philosophy for all 10 screens

Each screen should answer one of these questions:

1. **What needs attention?**
2. **Who/what is this account?**
3. **How is a new record created?**
4. **How is work captured?**
5. **How are issues monitored?**
6. **How is compliance tracked?**
7. **How is a decision justified?**
8. **How is a monthly output produced?**
9. **How is an annual output produced?**
10. **What does the customer eventually see?**

That maps directly to the proposed 10-screen product structure in the wireframes .

---

# Guidance for all 10 screens

## 1) Operations Dashboard

This should feel like the **morning command center**. The current dashboard already has the right structure: KPI strip, schedule, alerts/tasks, customer snapshot, monitoring center, compliance status, reports due, and recent activity .

### Demo feeling

* “I can understand the day in one glance.”
* Dense, live, in control
* This is the screen that proves the system is real

### Camera sequence

* Start on the **full dashboard**
* Hold long enough to read the overall composition
* Light focus on the **top KPI strip**
* Pan/zoom to **Today’s Schedule**
* Shift to **Alerts & Tasks**
* Pull right to **Customer Snapshot / Plan Distribution**
* Optional lower pass to **Monitoring Center / Compliance Status / Reports Due**
* End wide again

### Interaction cues

* KPI numbers can animate in subtly
* One alert row can become selected
* One schedule item can show active state
* Notification badge can pulse once
* Avoid overusing movement because this screen already has a lot on it

### Coding-agent note

Build the HTML to look complete at full-frame first. The demo engine should not depend on hidden sections or fake overlays. The whole page should read well when fully visible.

---

## 2) Customer Detail Screen

This should feel like the **single source of truth for one account**. The existing customer detail screen already shows the right tone: account hero, summary cards, overview/workspace tabs, service summary, compliance checklist, internal notes, and recent documents .

### Demo feeling

* “Everything about this customer lives here.”
* One screen, many layers of truth
* Operationally rich, but navigable

### Camera sequence

* Start on **full page**
* Hold on hero area and summary cards
* Zoom to **Account Overview**
* Slide to **Customer Workspace tabs**
* Show tab switch to **Compliance**
* Focus on **Compliance table**
* Shift to right rail **Compliance Checklist**
* End on **Internal Notes** or **Recent Documents**

### Interaction cues

* One or two tabs switch
* One row in compliance table gets selected
* Right-rail checklist can show hover/active state
* Do not add AI reasoning text over this page

### Coding-agent note

Preserve the density. This screen should not be simplified for demo. The full HTML should feel like a real operator workspace.

---

## 3) New Customer Onboarding

This should feel like **structured intake**, not a flashy wizard. The wireframe direction already defines customer type, account details, equipment details, plan assignment, and compliance flags .

### Demo feeling

* “This business can onboard a real account in one disciplined pass.”
* Operational setup with downstream consequences

### Camera sequence

* Show full page first
* Zoom to top section with **customer/account basics**
* Move to **equipment details**
* Move to **plan assignment**
* Land on **compliance flags**
* Brief end focus on **Save Customer**

### Interaction cues

* Radio/select changes
* A few checkboxes enable
* Plan selection becomes active
* No need for long typing animation; a few fields can populate quickly

### Coding-agent note

Make form sections visually distinct enough that the camera can isolate them cleanly. Maintain full-page readability first.

---

## 4) Service Visit / Report Entry

This should feel like the **heart of field execution becoming structured data**. The wireframe defines visit metadata, PM checklist, fuel/commercial checks, result, notes, attachments, and finalization .

### Demo feeling

* “Work performed becomes auditable record.”
* This is where the service business becomes software

### Camera sequence

* Full page establish
* Zoom to **visit header**
* Pan down through **PM checklist**
* Continue into **fuel/commercial checks**
* Focus on **result + notes**
* End on **attachments + Finalize Report**

### Interaction cues

* Several checklist items toggle
* Status changes to pass/complete
* Signature/attachment area highlights
* Finalize button gets one strong moment

### Coding-agent note

This screen should be vertically scannable. The engine will likely need controlled downward scroll.

---

## 5) Monitoring Center

This should feel like **triage and response**, not a telemetry science experiment. The wireframe supports filters, list/table of units, selected alert detail, suggested actions, notes, and resolution paths .

### Demo feeling

* “We know what needs attention and what to do next.”
* Live, operational, actionable

### Camera sequence

* Full page establish
* Focus on **filters + list of units**
* Select one alert row
* Shift to **selected alert detail**
* Hold on **suggested actions**
* End on **Resolve / Escalate / Create Work Order**

### Interaction cues

* Filter chip changes
* One alert row becomes selected
* Suggested-action checkboxes toggle
* Notes area can fill briefly
* One CTA receives emphasis

### Coding-agent note

Give the selected-alert region enough visual weight that it reads clearly when zoomed.

---

## 6) Compliance Tracker

This should feel like the **core differentiator**. It is where the product stops being “maintenance software” and becomes a compliance system. The wireframe includes requirement rows, statuses, update dates, next actions, notes/evidence, and export packet .

### Demo feeling

* “We can defend the account’s compliance posture.”
* Administrative confidence, not visual drama

### Camera sequence

* Full page establish
* Zoom to top filters/context controls
* Land on the **requirements table**
* Pause on one warning row
* Pause on one alert row
* Move to **notes/evidence**
* End on **Export Compliance Packet**

### Interaction cues

* Site/year/status filters can update
* Warning and alert rows can gain selection state
* Export action gets a subtle emphasis

### Coding-agent note

Rows should be easy to distinguish visually, especially green/warning/alert states without overwhelming the page.

---

## 7) Load Bank Decision Engine

This should feel like **transparent business logic**, not AI judgment. The wireframe makes the right move here by showing monthly threshold results, source, rule result, timing, estimated charge, and actions .

### Demo feeling

* “The system justifies the recommendation.”
* Calm, rational, evidence-based

### Camera sequence

* Show full page
* Zoom to **threshold history table**
* Scan down months and missed thresholds
* Move to **rule result**
* Hold on **recommended timing**
* End on action buttons

### Interaction cues

* One or two failed months get focus
* Rule result area can reveal line by line
* “Create Task” or “Add to Report” can get active state

### Coding-agent note

This page should feel analytical. Avoid excessive decorative widgets.

---

## 8) Monthly Report Generator

This should feel like **output assembly with confidence**. The wireframe includes report type, customer, period, include-sections checklist, preview summary, and outputs like PDF/email/save .

### Demo feeling

* “Reporting is generated from real operations data.”
* Controlled assembly, not creative composition

### Camera sequence

* Full page establish
* Zoom to **report controls**
* Shift to **include sections**
* Move to **preview summary**
* End on **Generate PDF / Email / Save**

### Interaction cues

* Checkboxes toggle
* Preview updates
* One output button is emphasized
* No giant PDF mock overlay needed unless we already have it

### Coding-agent note

Make the preview area visually distinct and large enough to feel meaningful when zoomed.

---

## 9) Annual Compliance Report Builder

This should feel like the **executive proof layer**. The wireframe defines customer/year, data sources, generated sections, warning state, and preview/export/send actions .

### Demo feeling

* “Everything required for the annual packet is assembled here.”
* High-value, high-trust, audit-ready

### Camera sequence

* Full page establish
* Focus on **customer/year and data sources**
* Move to **generated sections**
* Hold on **status: ready with warning**
* Focus the warning line
* End on **Preview / Export PDF / Send to Customer**

### Interaction cues

* Data source checks can appear already satisfied
* Warning state is visible but not catastrophic
* Export receives the strongest action emphasis

### Coding-agent note

This should be one of the cleanest and most boardroom-ready screens in the set.

---

## 10) Customer Portal

This should feel like the **simplified external-facing view**. The wireframe points toward current status, last check-in, recent events, documents, and recommendation area .

### Demo feeling

* “Customers see clarity, not internal complexity.”
* Simple, confident, reduced surface area

### Camera sequence

* Start with full page
* Hold on **current status**
* Move to **recent events**
* Shift to **documents**
* End on **recommendations**

### Interaction cues

* Download/view actions can highlight
* Status state can subtly pulse
* Keep this calmer than the ops screens

### Coding-agent note

This screen should feel like a distilled subset of the internal system, not a separate design language.

---

# Recommended sequence across all 10 screens

This is the cleanest narrative:

1. **Operations Dashboard** — what needs attention now
2. **Customer Detail** — what one account looks like in depth
3. **New Customer Onboarding** — how new records enter the system
4. **Service Report Entry** — how real work gets captured
5. **Monitoring Center** — how the system surfaces issues
6. **Compliance Tracker** — how obligations are tracked
7. **Load Bank Decision Engine** — how logic becomes action
8. **Monthly Report Generator** — how recurring output is produced
9. **Annual Compliance Report Builder** — how audit-ready proof is assembled
10. **Customer Portal** — what the end customer eventually experiences

That sequencing is already strongly supported by the product framing and wireframes  .

---

# What to tell the coding agent

Use this as the instruction set.

## Build brief for all 10 HTML screens

Each screen should be designed as a **fully readable, complete HTML page** that works in three states:

1. **full-page visible**
2. **camera zoomed into one region**
3. **partial scroll/focus during demo**

Do not design any screen that only works when cropped.

### Requirements

* The full page must look finished and credible at 100% view
* Each page should have **2–4 obvious focus regions** for the demo engine
* Strong section separation is important
* Avoid relying on overlays that cover the actual UI
* Avoid AI commentary panels
* Preserve density; do not oversimplify for demo
* Use real-looking status chips, tables, lists, and cards
* Make scrollable pages still readable at a full-page view
* Keep interaction affordances visible even when static

### Desired demo behavior

The presentation engine will:

* establish the full page first
* zoom into important regions
* scroll when needed
* focus specific cards, rows, tabs, or action areas
* show real interactions like tab changes, row selection, and button states

So each page should be composed with:

* clear top-level hierarchy
* obvious focal zones
* natural reading paths
* good spacing between major panels

---

# Screen-by-screen build emphasis for the remaining seven

For the seven not yet built, prioritize:

## Onboarding

Form structure, section clarity, realistic fields.

## Service Report

Vertical checklist flow, operational notes, attachments/finalization.

## Monitoring

A crisp master-detail pattern.

## Compliance

A strong table with unmistakable state hierarchy.

## Load Bank Decision

Logic-first layout, readable evidence-to-decision flow.

## Monthly Report

Controls on one side, preview/output on the other.

## Annual Report

Executive-grade summary composition and export readiness.

## Customer Portal

Cleaner, quieter, simpler than the internal tools.

---

# One important guardrail

Because the client wants to **see the full HTML in each scene**, the demo should not try to “save” the viewer from density. The goal is not to simplify the system into a storyboard. The goal is to present a **real, complete interface** with disciplined camera direction.

So the creative standard is:

> **full-product realism, presentation-level framing**

Not:

> **invented narrative overlays standing in for the product**

