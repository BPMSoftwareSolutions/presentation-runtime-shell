Here’s a **tight 5-scene ASCII storyboard** you can use as the first draft for the demo.

# 5-Scene Demo Storyboard

## *From messy loan file to audit-ready closing package*

---

## Scene 1 — Messy Intake

**Goal:** show the pain immediately: too many docs, mixed statuses, no clean separation.

```text
+----------------------------------------------------------------------------------+
| SCENE 1: LOAN FILE INTAKE                                                        |
| "Everything is in one place, but nothing is clearly separated."                  |
+----------------------------------------------------------------------------------+

   Incoming Loan Folder
   ┌────────────────────────────────────────────────────────────────────────────┐
   │ Loan #48291                                                                │
   │                                                                            │
   │  [PDF] Closing Disclosure FINAL.pdf                                        │
   │  [PDF] Closing Disclosure revised.pdf                                      │
   │  [PDF] Borrower ID.pdf                                                     │
   │  [PDF] Note_signed.pdf                                                     │
   │  [PDF] Note_unsigned.pdf                                                   │
   │  [PDF] Title Commitment.pdf                                                │
   │  [PDF] Wiring Instructions OLD.pdf                                         │
   │  [PDF] Payoff Letter.pdf                                                   │
   │  [PDF] Escrow Worksheet.pdf                                                │
   │  [PDF] Misc Addendum draft.pdf                                             │
   │  [PDF] Compliance Notice.pdf                                               │
   │  [PDF] Random Scan 003.pdf                                                 │
   └────────────────────────────────────────────────────────────────────────────┘

                                 ↓
                    "What was actually used to close?"

   Auditor / Risk Question
   ┌───────────────────────────────────────────────┐
   │ Which docs were used?                         │
   │ Which were inactive?                          │
   │ Which versions were final?                    │
   │ Can you prove it fast?                        │
   └───────────────────────────────────────────────┘
```

**Presenter note:**
Start with tension. This scene should feel cluttered and slightly stressful.

---

## Scene 2 — System Identifies and Tags

**Goal:** show order emerging from chaos.

```text
+----------------------------------------------------------------------------------+
| SCENE 2: DOCUMENT IDENTITY + CLASSIFICATION                                     |
| "The system assigns identity, recognizes type, and groups likely duplicates."   |
+----------------------------------------------------------------------------------+

   Before                          Processing                         After
   ┌───────────────┐              ┌───────────────┐                 ┌───────────────┐
   │ random files  │  ───────▶    │ classify      │   ───────▶      │ tagged docs   │
   │ unclear names │              │ dedupe        │                 │ grouped docs  │
   │ mixed versions│              │ assign IDs    │                 │ clearer status │
   └───────────────┘              └───────────────┘                 └───────────────┘


   Tagged Document Stack
   ┌────────────────────────────────────────────────────────────────────────────┐
   │ [DOC: DISC-CD-V2]   Closing Disclosure revised.pdf   → Type: Disclosure   │
   │ [DOC: DISC-CD-V3]   Closing Disclosure FINAL.pdf     → Type: Disclosure   │
   │ [DOC: NOTE-V1]      Note_unsigned.pdf               → Type: Note         │
   │ [DOC: NOTE-V2]      Note_signed.pdf                 → Type: Note         │
   │ [DOC: TITLE-01]     Title Commitment.pdf            → Type: Title        │
   │ [DOC: PAYOFF-01]    Payoff Letter.pdf               → Type: Payoff       │
   │ [DOC: ANC-ESC-01]   Escrow Worksheet.pdf            → Type: Ancillary    │
   │ [DOC: ANC-MISC-01]  Misc Addendum draft.pdf         → Type: Ancillary    │
   └────────────────────────────────────────────────────────────────────────────┘

   Duplicate / Version Groups
   ┌─────────────────────────────────────────────┐
   │ Closing Disclosure → 2 versions found       │
   │ Note               → signed + unsigned      │
   │ Wiring Instructions→ possible outdated doc  │
   └─────────────────────────────────────────────┘
```

**Presenter note:**
This is where Ms. Roni sees that her numbering instinct is being elevated into a real system.

---

## Scene 3 — Used in Closing vs Not Used

**Goal:** show human judgment supported by the system, not replaced by it.

```text
+----------------------------------------------------------------------------------+
| SCENE 3: CLOSING DECISION WORKFLOW                                              |
| "The reviewer confirms what actually mattered in the closing."                  |
+----------------------------------------------------------------------------------+

   Review Queue
   ┌────────────────────────────────────────────────────────────────────────────┐
   │ Document: Closing Disclosure                                               │
   │ Versions found: 2                                                          │
   │                                                                            │
   │  ( ) V2 - revised, unsigned / older                                        │
   │  (X) V3 - final, signed / used in closing                                  │
   │                                                                            │
   │ Action:                                                                    │
   │   [Mark as Used in Closing]   [Archive Other Version]                      │
   └────────────────────────────────────────────────────────────────────────────┘


   Review Queue
   ┌────────────────────────────────────────────────────────────────────────────┐
   │ Document: Note                                                             │
   │ Versions found: 2                                                          │
   │                                                                            │
   │  ( ) V1 - unsigned                                                         │
   │  (X) V2 - signed / final                                                   │
   │                                                                            │
   │ Action:                                                                    │
   │   [Mark as Used in Closing]   [Supersede Unsigned]                         │
   └────────────────────────────────────────────────────────────────────────────┘


   Status Board
   ┌────────────────────────────────────────────────────────────────────────────┐
   │ USED IN CLOSING      │ NOT USED / ANCILLARY   │ NEEDS REVIEW               │
   │----------------------│------------------------│----------------------------│
   │ Closing Disclosure   │ Escrow Worksheet       │ Wiring Instructions OLD    │
   │ Note                 │ Misc Addendum draft    │ Random Scan 003            │
   │ Payoff Letter        │ Compliance Notice      │                            │
   │ Title Commitment     │                        │                            │
   └────────────────────────────────────────────────────────────────────────────┘
```

**Presenter note:**
The important emotional move here is: *“I’m still in control, but now it’s explicit and traceable.”*

---

## Scene 4 — Clean Separation for Audit Safety

**Goal:** visually prove that closing docs and inactive docs are separated.

```text
+----------------------------------------------------------------------------------+
| SCENE 4: SEPARATION OF RECORD                                                   |
| "The system produces a clean closing package and a separate inactive archive."  |
+----------------------------------------------------------------------------------+

                           Finalized File Routing
   ┌────────────────────────────────────────────────────────────────────────────┐
   │                                                                            │
   │    USED IN CLOSING                          NOT USED / ANCILLARY           │
   │    ───────────────                          ─────────────────────           │
   │                                                                            │
   │   ┌──────────────────────┐               ┌──────────────────────────┐      │
   │   │  CLOSING PACKAGE     │               │  INACTIVE / ANCILLARY    │      │
   │   │----------------------│               │  ARCHIVE                 │      │
   │   │  • Closing Disclosure│               │--------------------------│      │
   │   │  • Signed Note       │               │  • Escrow Worksheet      │      │
   │   │  • Payoff Letter     │               │  • Draft Addendum        │      │
   │   │  • Title Commitment  │               │  • Compliance Notice     │      │
   │   └──────────────────────┘               └──────────────────────────┘      │
   │                                                                            │
   │                  Exceptions / flagged for policy review                     │
   │                 ┌──────────────────────────────────────┐                    │
   │                 │ Wiring Instructions OLD              │                    │
   │                 │ Random Scan 003                      │                    │
   │                 └──────────────────────────────────────┘                    │
   │                                                                            │
   └────────────────────────────────────────────────────────────────────────────┘
```

**Presenter note:**
This is probably the key “aha” scene. Keep it simple and visually satisfying.

---

## Scene 5 — Audit View / Proof Screen

**Goal:** finish with confidence: the system can explain what happened.

```text
+----------------------------------------------------------------------------------+
| SCENE 5: AUDIT REPORT                                                           |
| "At any moment, you can show what was used, what was excluded, and why."       |
+----------------------------------------------------------------------------------+

   Audit Summary
   ┌────────────────────────────────────────────────────────────────────────────┐
   │ Loan #48291 Audit Snapshot                                                 │
   │----------------------------------------------------------------------------│
   │ Total documents received:                  12                              │
   │ Used in closing:                           4                               │
   │ Archived as inactive / ancillary:          3                               │
   │ Superseded / duplicate:                    3                               │
   │ Exceptions reviewed:                       2                               │
   │----------------------------------------------------------------------------│
   │ Closing package status:                    AUDIT-READY                     │
   └────────────────────────────────────────────────────────────────────────────┘


   Timeline / Chain of Custody
   ┌────────────────────────────────────────────────────────────────────────────┐
   │ 09:14 AM  Intake completed                                                 │
   │ 09:15 AM  Documents classified                                             │
   │ 09:17 AM  Duplicate groups created                                         │
   │ 09:21 AM  Reviewer marked final Closing Disclosure as used                 │
   │ 09:22 AM  Unsigned Note marked superseded                                  │
   │ 09:24 AM  Ancillary docs archived separately                               │
   │ 09:25 AM  Audit-ready closing package generated                            │
   └────────────────────────────────────────────────────────────────────────────┘


   Quick Questions an Auditor Might Ask
   ┌────────────────────────────────────────────────────────────────────────────┐
   │ Q: Which Closing Disclosure was used?                                      │
   │ A: DISC-CD-V3, signed final version                                        │
   │                                                                            │
   │ Q: Why is the earlier version not in the closing package?                  │
   │ A: Superseded by final signed version; archived                            │
   │                                                                            │
   │ Q: Were ancillary documents mixed into closing docs?                       │
   │ A: No. They were separated into inactive archive                           │
   └────────────────────────────────────────────────────────────────────────────┘
```

**Presenter note:**
End on calm confidence. The system should feel like it reduces anxiety.

---

# Ultra-Compressed Version

If you want a **very tight five-click flow**, it is this:

```text
1. MESSY FILES
   [mixed docs] [duplicates] [drafts] [signed/unsigned]

2. AUTO-ORGANIZE
   identify → classify → assign IDs → group versions

3. REVIEW
   choose final used docs
   mark unused / superseded / ancillary

4. SEPARATE
   Closing Package | Inactive Archive | Exceptions

5. PROVE
   audit summary + timeline + reason for every disposition
```

---

# Suggested On-Screen Titles

You can use these exact titles in the demo:

1. **Messy Loan File Intake**
2. **Document Identity and Classification**
3. **Used in Closing?**
4. **Separation of Record**
5. **Audit-Ready Proof**

---

# Suggested Voiceover Line for the Whole Demo

```text
A messy loan folder comes in.
The system identifies each document, groups duplicates and versions,
helps confirm what was actually used to close,
separates inactive documents from the official closing package,
and leaves behind a clean audit trail showing exactly what happened.
```
