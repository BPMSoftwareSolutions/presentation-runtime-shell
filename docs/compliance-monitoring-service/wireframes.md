Absolutely — here’s a **first-pass wireframe set** for the MVP.

I designed these around the business Thomas already has in the residential and commercial pitches: recurring service plans, monitoring, written reports, EPA/UST documentation, load-bank logic, and monthly status/compliance reporting. Residential includes annual, semi-annual, and Plus+ Monitoring tiers . Commercial includes Essential, Standard, and Premium+ tiers with compliance and monitoring baked in .

---

# MVP direction

I’d suggest the MVP start as:

> **an internal operations app first**
> not a customer-facing portal first

That means the first screens should help Thomas:

* onboard customers
* track equipment
* log visits
* manage compliance
* generate reports
* monitor exceptions

Then later, the cleanest subset becomes the customer dashboard.

---

# 1. Operations dashboard

This is the “open the app every morning” screen.

```text
+====================================================================================================+
| GENERATOR COMMAND CENTER                                                     [ Search ] [ + New ] |
+====================================================================================================+
| Today: 3 visits | 2 reports due | 1 compliance issue | 4 monitoring alerts                         |
+----------------------------------------------------------------------------------------------------+
| LEFT: SCHEDULE                          | CENTER: ALERTS / TASKS                                   |
|----------------------------------------+-----------------------------------------------------------|
| 08:00  Johnson Residence   Annual PM   | [HIGH] Shell Station 184                                 |
| 10:30  Oak Pharmacy        Standard    | Monthly threshold missed — load bank review needed       |
| 01:00  BP Station 12       Premium+    |                                                           |
|                                        | [MED] Carter Residence                                   |
| [ View Calendar ]                      | Battery weakness alert from PT Series                     |
|                                        |                                                           |
|                                        | [LOW] Kroger Backup Unit                                 |
|                                        | Annual compliance report due in 9 days                    |
+----------------------------------------+-----------------------------------------------------------+
| BOTTOM LEFT: CUSTOMER SNAPSHOT         | BOTTOM RIGHT: KPI STRIP                                  |
|----------------------------------------+-----------------------------------------------------------|
| Residential Clients     0X             | Active Plans                  0X                         |
| Commercial Clients      0X             | Monitoring Units Online       0X                         |
| Monitored Units         0X             | Reports Generated This Month  0X                         |
| Open Repair Issues      0X             | Compliance Exceptions         0X                         |
+====================================================================================================+
```

### Why this matters

This screen supports the real operating model in the pitch docs:

* recurring service plans
* monitoring alerts
* compliance/report due workflow
* commercial threshold/load bank decisions 

---

# 2. Customer detail screen

This is the core record for each client.

```text
+====================================================================================================+
| CUSTOMER PROFILE: Shell Station 184                                           [ Edit ] [ New Job ]|
+====================================================================================================+
| Account Type: Commercial         Plan: Premium+         Status: Active         Since: 2026-05-20  |
| Location: Birmingham, MI         Site Contact: _____________                   Phone: ____________ |
+----------------------------------------------------------------------------------------------------+
| EQUIPMENT                                    | SERVICE SUMMARY                                     |
|----------------------------------------------+-----------------------------------------------------|
| Generator: Kohler 60kW                       | Last PM Visit:       2026-08-14                     |
| Fuel Type: Diesel                            | Next Visit:          2027-02-14                     |
| Transfer Switch: Yes                         | Last Load Bank:      2026-03-18                     |
| Monitoring Unit: PT Series [Online]          | Last Report Sent:    2026-08-31                     |
| UST Related: Yes                             | Compliance Status:   GREEN                          |
+----------------------------------------------+-----------------------------------------------------+
| TABS: [ Overview ] [ Visits ] [ Monitoring ] [ Compliance ] [ Reports ] [ Files ]                |
+----------------------------------------------------------------------------------------------------+
| Recent Activity                                                                                   |
| - 08/31 Monthly threshold verification completed                                                  |
| - 08/14 Semi-annual PM service completed                                                          |
| - 08/14 ATP microbial fuel test logged                                                            |
| - 07/01 Monitoring alert: battery warning cleared                                                 |
+====================================================================================================+
```

### Key idea

One record should unify:

* service history
* monitoring status
* compliance status
* reports/files

That is the software version of “fully managed, always documented.”

---

# 3. New customer onboarding screen

This is where Thomas sets up the account fast.

```text
+====================================================================================================+
| NEW CUSTOMER SETUP                                                                               |
+====================================================================================================+
| Customer Type:   (•) Residential   ( ) Commercial                                                |
| Customer Name:   ____________________________________________                                     |
| Address:         ____________________________________________                                     |
| Contact Name:    ____________________________________________                                     |
| Phone / Email:   ____________________________________________                                     |
+----------------------------------------------------------------------------------------------------+
| EQUIPMENT DETAILS                                                                                 |
| Generator Brand: [ Kohler ▼ ]      Size: [ 20kW ▼ ]                                               |
| Fuel Type:       [ Natural Gas ▼ ]  Transfer Switch: [ Yes ▼ ]                                    |
| Serial Number:   __________________  Install Date: __________________                              |
| Monitoring Unit: [ None / PT Series / Existing ]                                                  |
+----------------------------------------------------------------------------------------------------+
| PLAN ASSIGNMENT                                                                                   |
| Residential Plans:  [ Annual ] [ Semi-Annual ] [ Plus+ Monitoring ]                              |
| Commercial Plans:   [ Essential ] [ Standard ] [ Premium+ ]                                      |
+----------------------------------------------------------------------------------------------------+
| COMPLIANCE FLAGS                                                                                  |
| [ ] UST involved                                                                                  |
| [ ] EPA run-hour logging required                                                                 |
| [ ] Monthly threshold verification required                                                       |
| [ ] Annual compliance report required                                                             |
| [ ] Load bank review applicable                                                                   |
+----------------------------------------------------------------------------------------------------+
|                                      [ Cancel ]    [ Save Customer ]                              |
+====================================================================================================+
```

### Why this matters

This allows different onboarding paths for:

* residential service plan setup 
* commercial compliance-heavy setup 

---

# 4. Visit / service report entry screen

This is probably the most important MVP screen.

```text
+====================================================================================================+
| SERVICE VISIT REPORT: Oak Pharmacy                                            Visit Date: 08/14   |
+====================================================================================================+
| Visit Type: [ Semi-Annual PM ▼ ]           Technician: Thomas __________________________________ |
| Generator Runtime Reading: ________ hrs    Transfer Switch Tested: [ Yes / No ]                  |
+----------------------------------------------------------------------------------------------------+
| PM CHECKLIST                                                                                      |
| [x] Engine oil / filter replaced                                                                  |
| [x] Air filter inspected                                                                          |
| [x] Battery / charging system tested                                                              |
| [x] Coolant checked                                                                               |
| [x] Belts / hoses / fuel lines inspected                                                          |
| [x] Operational run test completed                                                                |
| [x] Visual inspection complete                                                                    |
+----------------------------------------------------------------------------------------------------+
| FUEL / COMMERCIAL CHECKS                                                                          |
| [x] Fuel visual inspection                                                                        |
| [ ] Tank water bottom check                                                                       |
| [x] ATP microbial test                                                                            |
| [ ] ASTM D975 lab sample                                                                          |
| [ ] Fuel polishing needed                                                                         |
+----------------------------------------------------------------------------------------------------+
| RESULT                                                                                            |
| Overall Status: [ PASS ▼ ]                                                                        |
| Notes:                                                                                             |
| ________________________________________________________________________________________________  |
| ________________________________________________________________________________________________  |
+----------------------------------------------------------------------------------------------------+
| Attach Photos  [ + ]    Attach Test Docs [ + ]    Signature [ Capture ]                           |
|                                                       [ Save Draft ] [ Finalize Report ]          |
+====================================================================================================+
```

### MVP payoff

The moment this exists, Thomas is no longer “writing reports.”

He is entering structured data that can generate:

* visit reports
* monthly summaries
* annual reports
* compliance records

---

# 5. Monitoring / alert triage screen

This turns PT Series monitoring into a daily workflow.

```text
+====================================================================================================+
| MONITORING CENTER                                                                                |
+====================================================================================================+
| Filters: [ All ] [ Residential ] [ Commercial ] [ Open Alerts ] [ Battery ] [ Fault ] [ Offline ]|
+----------------------------------------------------------------------------------------------------+
| UNIT / SITE                  STATUS         LAST EVENT                  ACTION                     |
|----------------------------------------------------------------------------------------------------|
| Carter Residence            ALERT          Battery weakness            [ Open ]                    |
| Shell Station 184           ALERT          Threshold missed            [ Open ]                    |
| BP Station 12               ONLINE         Normal heartbeat            [ View ]                    |
| Kroger Backup Unit          OFFLINE        No signal for 14 hrs        [ Open ]                    |
+----------------------------------------------------------------------------------------------------+
| SELECTED ALERT: Shell Station 184                                                                  |
|----------------------------------------------------------------------------------------------------|
| Monitoring Unit: PT Series Cellular                                                               |
| Alert Type: Monthly exercise threshold not met                                                    |
| Triggered: 2026-08-31 07:15                                                                       |
| Risk: Load bank test may be required at next service interval                                      |
|                                                                                                    |
| Suggested Actions:                                                                                 |
| [ ] Create compliance task                                                                         |
| [ ] Flag customer record                                                                           |
| [ ] Include note in monthly report                                                                 |
| [ ] Schedule load bank evaluation                                                                  |
|                                                                                                    |
| Notes: __________________________________________________________________________                  |
|                                                [ Resolve ] [ Escalate ] [ Create Work Order ]     |
+====================================================================================================+
```

### Why this matters

Commercial Premium+ explicitly promises monthly threshold verification and monitoring-based handling .
Residential Plus+ also includes 24/7 monitoring, fault alerts, and monthly status reporting .

This is the bridge between hardware monitoring and service operations.

---

# 6. Compliance tracker screen

This is the big differentiator screen for commercial.

```text
+====================================================================================================+
| COMPLIANCE TRACKER                                                                               |
+====================================================================================================+
| Site: [ Shell Station 184 ▼ ]      Status: [ GREEN ▼ ]      Period: [ 2026 ▼ ]                   |
+----------------------------------------------------------------------------------------------------+
| REQUIREMENT                                STATUS      LAST UPDATED       NEXT ACTION              |
|----------------------------------------------------------------------------------------------------|
| EPA run-hour logging                       OK          08/31/2026         Monthly review           |
| Exercise vs outage separation              OK          08/31/2026         Auto from monitoring     |
| UST documentation review                   WARNING     08/14/2026         Missing August upload    |
| NFPA 110 monthly exercise threshold        ALERT       08/31/2026         Evaluate load bank need  |
| Annual compliance report                   OK          01/12/2026         Due Jan 2027             |
| CEDRI filing                               OK          01/12/2026         None                     |
| Records retention                          OK          08/31/2026         Maintain 3-year history  |
+----------------------------------------------------------------------------------------------------+
| NOTES / EVIDENCE                                                                                  |
| - August threshold missed                                                                         |
| - Review if spring PM should include triggered load bank test                                     |
| - Missing UST documentation from customer manager                                                 |
+----------------------------------------------------------------------------------------------------+
|                                              [ Export Compliance Packet ] [ Add Note ]            |
+====================================================================================================+
```

### Why this matters

This is the software expression of the commercial promise:

* EPA logging
* UST documentation review
* threshold-based load bank logic
* annual compliance reporting
* records management 

---

# 7. Load bank decision screen

This deserves its own workflow because it’s operationally and financially important.

```text
+====================================================================================================+
| LOAD BANK DECISION ENGINE                                                                        |
+====================================================================================================+
| Customer: Shell Station 184                     Plan: Standard                                     |
| Annual Review Window: Jan–Dec 2026                                                               |
+----------------------------------------------------------------------------------------------------+
| MONTH              EXERCISE RUN MET 30% THRESHOLD?        SOURCE                                  |
|----------------------------------------------------------------------------------------------------|
| Jan                YES                               Monitoring / manual log                       |
| Feb                YES                               Monitoring / manual log                       |
| Mar                YES                               Monitoring / manual log                       |
| Apr                NO                                Monitoring / manual log                       |
| May                YES                               Monitoring / manual log                       |
| Jun                YES                               Monitoring / manual log                       |
| Jul                YES                               Monitoring / manual log                       |
| Aug                NO                                Monitoring / manual log                       |
+----------------------------------------------------------------------------------------------------+
| RULE RESULT                                                                                        |
| - Monthly threshold missed: YES                                                                   |
| - Trigger annual load bank requirement: YES                                                       |
| - Recommended timing: Next spring PM visit                                                        |
| - Estimated charge: $275 add-on                                                                    |
+----------------------------------------------------------------------------------------------------+
|                                            [ Create Task ] [ Add to Report ] [ Dismiss ]         |
+====================================================================================================+
```

### Why this matters

Thomas’s commercial pitch explicitly differentiates on doing load bank tests **only when actual data requires it** rather than blindly every visit .

This screen makes that logic visible and repeatable.

---

# 8. Monthly report generator screen

This is where the software starts feeling like a real product.

```text
+====================================================================================================+
| REPORT GENERATOR                                                                                 |
+====================================================================================================+
| Report Type: [ Monthly Status Report ▼ ]                                                          |
| Customer:    [ Carter Residence ▼ ]                                                               |
| Period:      [ August 2026 ▼ ]                                                                    |
+----------------------------------------------------------------------------------------------------+
| INCLUDE SECTIONS                                                                                  |
| [x] Service history                                                                               |
| [x] Monitoring events                                                                             |
| [x] Current generator status                                                                      |
| [x] Fault summary                                                                                 |
| [ ] Compliance section                                                                            |
| [ ] Fuel quality section                                                                          |
| [x] Recommendations                                                                               |
+----------------------------------------------------------------------------------------------------+
| PREVIEW SUMMARY                                                                                   |
| - Generator online and reporting normally                                                         |
| - 1 battery weakness alert detected and resolved                                                  |
| - No outage events this period                                                                    |
| - Recommend battery replacement during next visit                                                 |
+----------------------------------------------------------------------------------------------------+
| OUTPUT                                                                                            |
| [ Generate PDF ]   [ Email to Customer ]   [ Save to Files ]                                      |
+====================================================================================================+
```

### Residential angle

This aligns directly with the residential Plus+ promise of a **monthly status report** .

---

# 9. Annual compliance report generator

This is the commercial showcase.

```text
+====================================================================================================+
| ANNUAL COMPLIANCE REPORT BUILDER                                                                 |
+====================================================================================================+
| Customer: [ Shell Station 184 ▼ ]        Report Year: [ 2026 ▼ ]                                  |
+----------------------------------------------------------------------------------------------------+
| DATA SOURCES                                                                                      |
| [x] Service visit records                                                                         |
| [x] Monitoring logs                                                                               |
| [x] EPA run-hour logs                                                                             |
| [x] Exercise vs outage classification                                                             |
| [x] UST document checklist                                                                        |
| [x] Load bank / extended run records                                                              |
+----------------------------------------------------------------------------------------------------+
| GENERATED SECTIONS                                                                                |
| [x] Executive summary                                                                             |
| [x] Operating hours summary                                                                       |
| [x] Threshold compliance summary                                                                  |
| [x] UST / fuel documentation                                                                      |
| [x] Exceptions and resolutions                                                                    |
| [x] Attached evidence index                                                                       |
+----------------------------------------------------------------------------------------------------+
| STATUS: READY WITH 1 WARNING                                                                      |
| Warning: August UST document missing — report can generate with open exception note               |
+----------------------------------------------------------------------------------------------------+
|                                    [ Preview ] [ Export PDF ] [ Send to Customer ]               |
+====================================================================================================+
```

---

# 10. Customer-facing portal screen

This is phase 2, but worth sketching now.

```text
+====================================================================================================+
| MY GENERATOR STATUS                                                                              |
+====================================================================================================+
| Customer: Carter Residence                                          Plan: Plus+ Monitoring        |
+----------------------------------------------------------------------------------------------------+
| CURRENT STATUS                                                                                   |
| [ GREEN ] Generator online                                                                        |
| Last check-in: Today 07:42                                                                        |
| Last service visit: 08/14/2026                                                                    |
| Next planned service: 02/14/2027                                                                  |
+----------------------------------------------------------------------------------------------------+
| RECENT EVENTS                                                                                     |
| - 08/22 Battery weakness alert                                                                    |
| - 08/22 Alert cleared                                                                             |
| - 08/14 Semi-annual service completed                                                             |
+----------------------------------------------------------------------------------------------------+
| DOCUMENTS                                                                                         |
| [ Download latest service report ]                                                                |
| [ Download monthly status report ]                                                                |
| [ View service history ]                                                                          |
+----------------------------------------------------------------------------------------------------+
| RECOMMENDATIONS                                                                                   |
| Replace battery at next visit                                                                     |
+====================================================================================================+
```

This one is intentionally simple. Customers do not need the full ops system.

---

# 11. Demo-friendly presentation flow

Since you also want this to become a real demo in your presentation system, here’s the cleanest MVP story:

```text
Scene 1  Title card
Scene 2  Ops dashboard with alerts
Scene 3  Open customer profile
Scene 4  Show visit report entry
Scene 5  Monitoring alert fires
Scene 6  Compliance tracker highlights issue
Scene 7  Load bank decision engine explains trigger
Scene 8  Monthly / annual report generated
Scene 9  Closing: service business becomes platform
```

That would fit very naturally with the presentation runtime structure you’ve already been using for other demos  .

