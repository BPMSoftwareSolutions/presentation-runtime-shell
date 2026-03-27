Below is a **single HTML scaffold** for all 10 demo screens, organized as presentation-ready sections. I kept it intentionally structural: semantic regions, placeholder data, clear class names, and no styling beyond minimal utility hooks. The content is aligned to the residential/commercial service tiers, monitoring, reporting, compliance, and load-bank logic from Thomas’s materials  , and it is shaped so you can break these into runtime scenes later if you want to map them into your presentation shell workflow  .

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Generator Command Center Demo</title>
</head>
<body>
  <main class="demo demo-generator-command-center" data-demo="generator-command-center">

    <!-- ========================================================= -->
    <!-- SCREEN 01: OPERATIONS DASHBOARD                           -->
    <!-- ========================================================= -->
    <section
      id="screen-01-operations-dashboard"
      class="screen screen--dashboard"
      data-screen="operations-dashboard"
      aria-labelledby="screen-01-title"
    >
      <header class="screen__header">
        <div class="screen__eyebrow">Screen 01</div>
        <h1 id="screen-01-title" class="screen__title">Operations Dashboard</h1>
        <p class="screen__subtitle">Morning command center for service, alerts, reports, and compliance tasks.</p>
      </header>

      <div class="screen__toolbar">
        <div class="toolbar__brand">Generator Command Center</div>
        <form class="toolbar__search" role="search">
          <label for="global-search" class="sr-only">Search</label>
          <input id="global-search" name="q" type="search" placeholder="Search customers, sites, or units" />
        </form>
        <div class="toolbar__actions">
          <button type="button">+ New</button>
        </div>
      </div>

      <section class="summary-strip" aria-label="Today summary">
        <article class="summary-card">
          <h2>Today</h2>
          <p>3 visits scheduled</p>
        </article>
        <article class="summary-card">
          <h2>Reports</h2>
          <p>2 due today</p>
        </article>
        <article class="summary-card">
          <h2>Compliance</h2>
          <p>1 active issue</p>
        </article>
        <article class="summary-card">
          <h2>Monitoring</h2>
          <p>4 open alerts</p>
        </article>
      </section>

      <div class="screen__grid screen__grid--two-by-two">
        <section class="panel panel--schedule" aria-labelledby="schedule-title">
          <header class="panel__header">
            <h2 id="schedule-title">Schedule</h2>
            <button type="button">View Calendar</button>
          </header>
          <ol class="schedule-list">
            <li class="schedule-item">
              <time datetime="2026-09-01T08:00">08:00</time>
              <div>
                <strong>Johnson Residence</strong>
                <span>Annual PM</span>
              </div>
            </li>
            <li class="schedule-item">
              <time datetime="2026-09-01T10:30">10:30</time>
              <div>
                <strong>Oak Pharmacy</strong>
                <span>Standard</span>
              </div>
            </li>
            <li class="schedule-item">
              <time datetime="2026-09-01T13:00">01:00</time>
              <div>
                <strong>BP Station 12</strong>
                <span>Premium+</span>
              </div>
            </li>
          </ol>
        </section>

        <section class="panel panel--alerts" aria-labelledby="alerts-title">
          <header class="panel__header">
            <h2 id="alerts-title">Alerts & Tasks</h2>
          </header>
          <ul class="alert-list">
            <li class="alert alert--high">
              <strong>Shell Station 184</strong>
              <p>Monthly threshold missed — review load bank need.</p>
            </li>
            <li class="alert alert--medium">
              <strong>Carter Residence</strong>
              <p>Battery weakness alert from PT Series.</p>
            </li>
            <li class="alert alert--low">
              <strong>Kroger Backup Unit</strong>
              <p>Annual compliance report due in 9 days.</p>
            </li>
          </ul>
        </section>

        <section class="panel panel--snapshot" aria-labelledby="snapshot-title">
          <header class="panel__header">
            <h2 id="snapshot-title">Customer Snapshot</h2>
          </header>
          <dl class="stats-list">
            <div><dt>Residential Clients</dt><dd>08</dd></div>
            <div><dt>Commercial Clients</dt><dd>04</dd></div>
            <div><dt>Monitored Units</dt><dd>07</dd></div>
            <div><dt>Open Repair Issues</dt><dd>03</dd></div>
          </dl>
        </section>

        <section class="panel panel--kpis" aria-labelledby="kpis-title">
          <header class="panel__header">
            <h2 id="kpis-title">KPIs</h2>
          </header>
          <dl class="stats-list">
            <div><dt>Active Plans</dt><dd>12</dd></div>
            <div><dt>Monitoring Units Online</dt><dd>07</dd></div>
            <div><dt>Reports Generated This Month</dt><dd>18</dd></div>
            <div><dt>Compliance Exceptions</dt><dd>02</dd></div>
          </dl>
        </section>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- SCREEN 02: CUSTOMER DETAIL                                -->
    <!-- ========================================================= -->
    <section
      id="screen-02-customer-profile"
      class="screen screen--customer-profile"
      data-screen="customer-profile"
      aria-labelledby="screen-02-title"
    >
      <header class="screen__header">
        <div class="screen__eyebrow">Screen 02</div>
        <h1 id="screen-02-title" class="screen__title">Customer Profile</h1>
        <p class="screen__subtitle">Unified record for service, monitoring, compliance, reports, and files.</p>
      </header>

      <article class="customer-profile">
        <header class="customer-profile__header">
          <div>
            <h2>Shell Station 184</h2>
            <p>Birmingham, MI</p>
          </div>
          <div class="header-actions">
            <button type="button">Edit</button>
            <button type="button">New Job</button>
          </div>
        </header>

        <dl class="customer-profile__meta">
          <div><dt>Account Type</dt><dd>Commercial</dd></div>
          <div><dt>Plan</dt><dd>Premium+</dd></div>
          <div><dt>Status</dt><dd>Active</dd></div>
          <div><dt>Since</dt><dd>2026-05-20</dd></div>
          <div><dt>Site Contact</dt><dd>Manager Name</dd></div>
          <div><dt>Phone</dt><dd>(555) 555-0198</dd></div>
        </dl>

        <div class="screen__grid screen__grid--two-column">
          <section class="panel">
            <header class="panel__header">
              <h3>Equipment</h3>
            </header>
            <dl class="detail-list">
              <div><dt>Generator</dt><dd>Kohler 60kW</dd></div>
              <div><dt>Fuel Type</dt><dd>Diesel</dd></div>
              <div><dt>Transfer Switch</dt><dd>Yes</dd></div>
              <div><dt>Monitoring Unit</dt><dd>PT Series — Online</dd></div>
              <div><dt>UST Related</dt><dd>Yes</dd></div>
            </dl>
          </section>

          <section class="panel">
            <header class="panel__header">
              <h3>Service Summary</h3>
            </header>
            <dl class="detail-list">
              <div><dt>Last PM Visit</dt><dd>2026-08-14</dd></div>
              <div><dt>Next Visit</dt><dd>2027-02-14</dd></div>
              <div><dt>Last Load Bank</dt><dd>2026-03-18</dd></div>
              <div><dt>Last Report Sent</dt><dd>2026-08-31</dd></div>
              <div><dt>Compliance Status</dt><dd>Green</dd></div>
            </dl>
          </section>
        </div>

        <nav class="tab-nav" aria-label="Customer tabs">
          <button type="button" aria-current="page">Overview</button>
          <button type="button">Visits</button>
          <button type="button">Monitoring</button>
          <button type="button">Compliance</button>
          <button type="button">Reports</button>
          <button type="button">Files</button>
        </nav>

        <section class="panel">
          <header class="panel__header">
            <h3>Recent Activity</h3>
          </header>
          <ul class="timeline">
            <li>08/31 — Monthly threshold verification completed</li>
            <li>08/14 — Semi-annual PM service completed</li>
            <li>08/14 — ATP microbial fuel test logged</li>
            <li>07/01 — Monitoring alert: battery warning cleared</li>
          </ul>
        </section>
      </article>
    </section>

    <!-- ========================================================= -->
    <!-- SCREEN 03: NEW CUSTOMER ONBOARDING                        -->
    <!-- ========================================================= -->
    <section
      id="screen-03-customer-onboarding"
      class="screen screen--onboarding"
      data-screen="customer-onboarding"
      aria-labelledby="screen-03-title"
    >
      <header class="screen__header">
        <div class="screen__eyebrow">Screen 03</div>
        <h1 id="screen-03-title" class="screen__title">New Customer Setup</h1>
        <p class="screen__subtitle">Fast account creation for residential and commercial service plans.</p>
      </header>

      <form class="app-form onboarding-form">
        <section class="form-section">
          <h2>Customer Information</h2>
          <div class="form-grid">
            <label>
              <span>Customer Type</span>
              <select name="customerType">
                <option>Residential</option>
                <option>Commercial</option>
              </select>
            </label>
            <label>
              <span>Customer Name</span>
              <input type="text" name="customerName" />
            </label>
            <label>
              <span>Address</span>
              <input type="text" name="address" />
            </label>
            <label>
              <span>Contact Name</span>
              <input type="text" name="contactName" />
            </label>
            <label>
              <span>Phone</span>
              <input type="tel" name="phone" />
            </label>
            <label>
              <span>Email</span>
              <input type="email" name="email" />
            </label>
          </div>
        </section>

        <section class="form-section">
          <h2>Equipment Details</h2>
          <div class="form-grid">
            <label>
              <span>Generator Brand</span>
              <select name="brand">
                <option>Kohler</option>
                <option>Generac</option>
                <option>Cummins</option>
              </select>
            </label>
            <label>
              <span>Size</span>
              <select name="size">
                <option>20kW</option>
                <option>40kW</option>
                <option>60kW</option>
              </select>
            </label>
            <label>
              <span>Fuel Type</span>
              <select name="fuelType">
                <option>Natural Gas</option>
                <option>Diesel</option>
                <option>Propane</option>
              </select>
            </label>
            <label>
              <span>Transfer Switch</span>
              <select name="transferSwitch">
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
            <label>
              <span>Serial Number</span>
              <input type="text" name="serialNumber" />
            </label>
            <label>
              <span>Install Date</span>
              <input type="date" name="installDate" />
            </label>
            <label>
              <span>Monitoring Unit</span>
              <select name="monitoringUnit">
                <option>None</option>
                <option>PT Series</option>
                <option>Existing</option>
              </select>
            </label>
          </div>
        </section>

        <section class="form-section">
          <h2>Plan Assignment</h2>
          <div class="form-grid">
            <fieldset>
              <legend>Residential Plans</legend>
              <label><input type="radio" name="resPlan" /> Annual</label>
              <label><input type="radio" name="resPlan" /> Semi-Annual</label>
              <label><input type="radio" name="resPlan" /> Plus+ Monitoring</label>
            </fieldset>
            <fieldset>
              <legend>Commercial Plans</legend>
              <label><input type="radio" name="comPlan" /> Essential</label>
              <label><input type="radio" name="comPlan" /> Standard</label>
              <label><input type="radio" name="comPlan" /> Premium+</label>
            </fieldset>
          </div>
        </section>

        <section class="form-section">
          <h2>Compliance Flags</h2>
          <div class="checkbox-grid">
            <label><input type="checkbox" /> UST involved</label>
            <label><input type="checkbox" /> EPA run-hour logging required</label>
            <label><input type="checkbox" /> Monthly threshold verification required</label>
            <label><input type="checkbox" /> Annual compliance report required</label>
            <label><input type="checkbox" /> Load bank review applicable</label>
          </div>
        </section>

        <footer class="form-actions">
          <button type="button">Cancel</button>
          <button type="submit">Save Customer</button>
        </footer>
      </form>
    </section>

    <!-- ========================================================= -->
    <!-- SCREEN 04: SERVICE VISIT REPORT                           -->
    <!-- ========================================================= -->
    <section
      id="screen-04-service-report"
      class="screen screen--service-report"
      data-screen="service-report"
      aria-labelledby="screen-04-title"
    >
      <header class="screen__header">
        <div class="screen__eyebrow">Screen 04</div>
        <h1 id="screen-04-title" class="screen__title">Service Visit Report</h1>
        <p class="screen__subtitle">Structured visit entry that later powers reports, summaries, and compliance packets.</p>
      </header>

      <form class="app-form service-report-form">
        <section class="form-section">
          <div class="form-grid">
            <label>
              <span>Customer</span>
              <input type="text" value="Oak Pharmacy" />
            </label>
            <label>
              <span>Visit Date</span>
              <input type="date" value="2026-08-14" />
            </label>
            <label>
              <span>Visit Type</span>
              <select>
                <option>Semi-Annual PM</option>
              </select>
            </label>
            <label>
              <span>Technician</span>
              <input type="text" value="Thomas" />
            </label>
            <label>
              <span>Generator Runtime Reading</span>
              <input type="number" value="284" />
            </label>
            <label>
              <span>Transfer Switch Tested</span>
              <select>
                <option>Yes</option>
                <option>No</option>
              </select>
            </label>
          </div>
        </section>

        <div class="screen__grid screen__grid--two-column">
          <section class="form-section">
            <h2>PM Checklist</h2>
            <div class="checkbox-grid">
              <label><input type="checkbox" checked /> Engine oil / filter replaced</label>
              <label><input type="checkbox" checked /> Air filter inspected</label>
              <label><input type="checkbox" checked /> Battery / charging system tested</label>
              <label><input type="checkbox" checked /> Coolant checked</label>
              <label><input type="checkbox" checked /> Belts / hoses / fuel lines inspected</label>
              <label><input type="checkbox" checked /> Operational run test completed</label>
              <label><input type="checkbox" checked /> Visual inspection complete</label>
            </div>
          </section>

          <section class="form-section">
            <h2>Fuel / Commercial Checks</h2>
            <div class="checkbox-grid">
              <label><input type="checkbox" checked /> Fuel visual inspection</label>
              <label><input type="checkbox" /> Tank water bottom check</label>
              <label><input type="checkbox" checked /> ATP microbial test</label>
              <label><input type="checkbox" /> ASTM D975 lab sample</label>
              <label><input type="checkbox" /> Fuel polishing needed</label>
            </div>
          </section>
        </div>

        <section class="form-section">
          <h2>Result</h2>
          <div class="form-grid">
            <label>
              <span>Overall Status</span>
              <select>
                <option>Pass</option>
                <option>Warning</option>
                <option>Fail</option>
              </select>
            </label>
          </div>
          <label class="textarea-field">
            <span>Notes</span>
            <textarea rows="6">Generator performed normally. Recommend battery replacement during next visit.</textarea>
          </label>
        </section>

        <footer class="form-actions">
          <button type="button">Attach Photos</button>
          <button type="button">Attach Test Docs</button>
          <button type="button">Capture Signature</button>
          <button type="button">Save Draft</button>
          <button type="submit">Finalize Report</button>
        </footer>
      </form>
    </section>

    <!-- ========================================================= -->
    <!-- SCREEN 05: MONITORING CENTER                              -->
    <!-- ========================================================= -->
    <section
      id="screen-05-monitoring-center"
      class="screen screen--monitoring"
      data-screen="monitoring-center"
      aria-labelledby="screen-05-title"
    >
      <header class="screen__header">
        <div class="screen__eyebrow">Screen 05</div>
        <h1 id="screen-05-title" class="screen__title">Monitoring Center</h1>
        <p class="screen__subtitle">Daily alert triage from PT Series monitoring and site telemetry.</p>
      </header>

      <div class="filter-bar" role="toolbar" aria-label="Monitoring filters">
        <button type="button">All</button>
        <button type="button">Residential</button>
        <button type="button">Commercial</button>
        <button type="button">Open Alerts</button>
        <button type="button">Battery</button>
        <button type="button">Fault</button>
        <button type="button">Offline</button>
      </div>

      <div class="screen__grid screen__grid--two-column">
        <section class="panel">
          <header class="panel__header">
            <h2>Units & Status</h2>
          </header>
          <table class="data-table">
            <thead>
              <tr>
                <th>Unit / Site</th>
                <th>Status</th>
                <th>Last Event</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Carter Residence</td>
                <td>Alert</td>
                <td>Battery weakness</td>
                <td><button type="button">Open</button></td>
              </tr>
              <tr>
                <td>Shell Station 184</td>
                <td>Alert</td>
                <td>Threshold missed</td>
                <td><button type="button">Open</button></td>
              </tr>
              <tr>
                <td>BP Station 12</td>
                <td>Online</td>
                <td>Normal heartbeat</td>
                <td><button type="button">View</button></td>
              </tr>
              <tr>
                <td>Kroger Backup Unit</td>
                <td>Offline</td>
                <td>No signal for 14 hrs</td>
                <td><button type="button">Open</button></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="panel panel--selected-alert">
          <header class="panel__header">
            <h2>Selected Alert</h2>
          </header>
          <dl class="detail-list">
            <div><dt>Site</dt><dd>Shell Station 184</dd></div>
            <div><dt>Monitoring Unit</dt><dd>PT Series Cellular</dd></div>
            <div><dt>Alert Type</dt><dd>Monthly exercise threshold not met</dd></div>
            <div><dt>Triggered</dt><dd>2026-08-31 07:15</dd></div>
            <div><dt>Risk</dt><dd>Load bank test may be required at next service interval</dd></div>
          </dl>

          <fieldset class="task-checklist">
            <legend>Suggested Actions</legend>
            <label><input type="checkbox" /> Create compliance task</label>
            <label><input type="checkbox" /> Flag customer record</label>
            <label><input type="checkbox" /> Include note in monthly report</label>
            <label><input type="checkbox" /> Schedule load bank evaluation</label>
          </fieldset>

          <label class="textarea-field">
            <span>Notes</span>
            <textarea rows="5"></textarea>
          </label>

          <footer class="panel__footer">
            <button type="button">Resolve</button>
            <button type="button">Escalate</button>
            <button type="button">Create Work Order</button>
          </footer>
        </section>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- SCREEN 06: COMPLIANCE TRACKER                             -->
    <!-- ========================================================= -->
    <section
      id="screen-06-compliance-tracker"
      class="screen screen--compliance"
      data-screen="compliance-tracker"
      aria-labelledby="screen-06-title"
    >
      <header class="screen__header">
        <div class="screen__eyebrow">Screen 06</div>
        <h1 id="screen-06-title" class="screen__title">Compliance Tracker</h1>
        <p class="screen__subtitle">Inspection-readiness view for EPA, UST, threshold, and records management.</p>
      </header>

      <div class="screen__toolbar">
        <label>
          <span>Site</span>
          <select>
            <option>Shell Station 184</option>
          </select>
        </label>
        <label>
          <span>Status</span>
          <select>
            <option>Green</option>
            <option>Warning</option>
            <option>Alert</option>
          </select>
        </label>
        <label>
          <span>Period</span>
          <select>
            <option>2026</option>
          </select>
        </label>
      </div>

      <section class="panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Requirement</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Next Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>EPA run-hour logging</td>
              <td>OK</td>
              <td>08/31/2026</td>
              <td>Monthly review</td>
            </tr>
            <tr>
              <td>Exercise vs outage separation</td>
              <td>OK</td>
              <td>08/31/2026</td>
              <td>Auto from monitoring</td>
            </tr>
            <tr>
              <td>UST documentation review</td>
              <td>Warning</td>
              <td>08/14/2026</td>
              <td>Missing August upload</td>
            </tr>
            <tr>
              <td>NFPA 110 monthly exercise threshold</td>
              <td>Alert</td>
              <td>08/31/2026</td>
              <td>Evaluate load bank need</td>
            </tr>
            <tr>
              <td>Annual compliance report</td>
              <td>OK</td>
              <td>01/12/2026</td>
              <td>Due Jan 2027</td>
            </tr>
            <tr>
              <td>CEDRI filing</td>
              <td>OK</td>
              <td>01/12/2026</td>
              <td>None</td>
            </tr>
            <tr>
              <td>Records retention</td>
              <td>OK</td>
              <td>08/31/2026</td>
              <td>Maintain 3-year history</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="panel">
        <header class="panel__header">
          <h2>Notes & Evidence</h2>
        </header>
        <ul class="timeline">
          <li>August threshold missed</li>
          <li>Review whether spring PM should include triggered load bank test</li>
          <li>Missing UST documentation from customer manager</li>
        </ul>
        <footer class="panel__footer">
          <button type="button">Export Compliance Packet</button>
          <button type="button">Add Note</button>
        </footer>
      </section>
    </section>

    <!-- ========================================================= -->
    <!-- SCREEN 07: LOAD BANK DECISION ENGINE                      -->
    <!-- ========================================================= -->
    <section
      id="screen-07-load-bank-decision"
      class="screen screen--load-bank"
      data-screen="load-bank-decision"
      aria-labelledby="screen-07-title"
    >
      <header class="screen__header">
        <div class="screen__eyebrow">Screen 07</div>
        <h1 id="screen-07-title" class="screen__title">Load Bank Decision Engine</h1>
        <p class="screen__subtitle">Threshold-based testing logic instead of unnecessary blanket testing.</p>
      </header>

      <section class="panel">
        <header class="panel__header">
          <h2>Context</h2>
        </header>
        <dl class="detail-list detail-list--inline">
          <div><dt>Customer</dt><dd>Shell Station 184</dd></div>
          <div><dt>Plan</dt><dd>Standard</dd></div>
          <div><dt>Annual Review Window</dt><dd>Jan–Dec 2026</dd></div>
        </dl>
      </section>

      <section class="panel">
        <table class="data-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Exercise Run Met 30% Threshold?</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Jan</td><td>Yes</td><td>Monitoring / manual log</td></tr>
            <tr><td>Feb</td><td>Yes</td><td>Monitoring / manual log</td></tr>
            <tr><td>Mar</td><td>Yes</td><td>Monitoring / manual log</td></tr>
            <tr><td>Apr</td><td>No</td><td>Monitoring / manual log</td></tr>
            <tr><td>May</td><td>Yes</td><td>Monitoring / manual log</td></tr>
            <tr><td>Jun</td><td>Yes</td><td>Monitoring / manual log</td></tr>
            <tr><td>Jul</td><td>Yes</td><td>Monitoring / manual log</td></tr>
            <tr><td>Aug</td><td>No</td><td>Monitoring / manual log</td></tr>
          </tbody>
        </table>
      </section>

      <section class="decision-summary">
        <article class="decision-card">
          <h2>Rule Result</h2>
          <ul>
            <li>Monthly threshold missed: <strong>Yes</strong></li>
            <li>Trigger annual load bank requirement: <strong>Yes</strong></li>
            <li>Recommended timing: <strong>Next spring PM visit</strong></li>
            <li>Estimated charge: <strong>$275 add-on</strong></li>
          </ul>
        </article>

        <div class="decision-actions">
          <button type="button">Create Task</button>
          <button type="button">Add to Report</button>
          <button type="button">Dismiss</button>
        </div>
      </section>
    </section>

    <!-- ========================================================= -->
    <!-- SCREEN 08: MONTHLY REPORT GENERATOR                       -->
    <!-- ========================================================= -->
    <section
      id="screen-08-monthly-report-generator"
      class="screen screen--report-generator"
      data-screen="monthly-report-generator"
      aria-labelledby="screen-08-title"
    >
      <header class="screen__header">
        <div class="screen__eyebrow">Screen 08</div>
        <h1 id="screen-08-title" class="screen__title">Monthly Report Generator</h1>
        <p class="screen__subtitle">Customer-ready status reporting for monitoring, service, and recommendations.</p>
      </header>

      <div class="screen__grid screen__grid--two-column">
        <form class="app-form panel">
          <header class="panel__header">
            <h2>Report Settings</h2>
          </header>

          <div class="form-grid">
            <label>
              <span>Report Type</span>
              <select>
                <option>Monthly Status Report</option>
              </select>
            </label>
            <label>
              <span>Customer</span>
              <select>
                <option>Carter Residence</option>
              </select>
            </label>
            <label>
              <span>Period</span>
              <select>
                <option>August 2026</option>
              </select>
            </label>
          </div>

          <fieldset class="checkbox-grid">
            <legend>Include Sections</legend>
            <label><input type="checkbox" checked /> Service history</label>
            <label><input type="checkbox" checked /> Monitoring events</label>
            <label><input type="checkbox" checked /> Current generator status</label>
            <label><input type="checkbox" checked /> Fault summary</label>
            <label><input type="checkbox" /> Compliance section</label>
            <label><input type="checkbox" /> Fuel quality section</label>
            <label><input type="checkbox" checked /> Recommendations</label>
          </fieldset>

          <footer class="form-actions">
            <button type="button">Generate PDF</button>
            <button type="button">Email to Customer</button>
            <button type="button">Save to Files</button>
          </footer>
        </form>

        <section class="panel">
          <header class="panel__header">
            <h2>Preview Summary</h2>
          </header>
          <article class="report-preview">
            <h3>August 2026 — Carter Residence</h3>
            <ul>
              <li>Generator online and reporting normally</li>
              <li>1 battery weakness alert detected and resolved</li>
              <li>No outage events this period</li>
              <li>Recommend battery replacement during next visit</li>
            </ul>
          </article>
        </section>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- SCREEN 09: ANNUAL COMPLIANCE REPORT                       -->
    <!-- ========================================================= -->
    <section
      id="screen-09-annual-compliance-report"
      class="screen screen--annual-report"
      data-screen="annual-compliance-report"
      aria-labelledby="screen-09-title"
    >
      <header class="screen__header">
        <div class="screen__eyebrow">Screen 09</div>
        <h1 id="screen-09-title" class="screen__title">Annual Compliance Report Builder</h1>
        <p class="screen__subtitle">Commercial output that consolidates service records, logs, and evidence into one packet.</p>
      </header>

      <div class="screen__grid screen__grid--two-column">
        <section class="panel">
          <header class="panel__header">
            <h2>Builder</h2>
          </header>

          <div class="form-grid">
            <label>
              <span>Customer</span>
              <select>
                <option>Shell Station 184</option>
              </select>
            </label>
            <label>
              <span>Report Year</span>
              <select>
                <option>2026</option>
              </select>
            </label>
          </div>

          <fieldset class="checkbox-grid">
            <legend>Data Sources</legend>
            <label><input type="checkbox" checked /> Service visit records</label>
            <label><input type="checkbox" checked /> Monitoring logs</label>
            <label><input type="checkbox" checked /> EPA run-hour logs</label>
            <label><input type="checkbox" checked /> Exercise vs outage classification</label>
            <label><input type="checkbox" checked /> UST document checklist</label>
            <label><input type="checkbox" checked /> Load bank / extended run records</label>
          </fieldset>

          <fieldset class="checkbox-grid">
            <legend>Generated Sections</legend>
            <label><input type="checkbox" checked /> Executive summary</label>
            <label><input type="checkbox" checked /> Operating hours summary</label>
            <label><input type="checkbox" checked /> Threshold compliance summary</label>
            <label><input type="checkbox" checked /> UST / fuel documentation</label>
            <label><input type="checkbox" checked /> Exceptions and resolutions</label>
            <label><input type="checkbox" checked /> Attached evidence index</label>
          </fieldset>
        </section>

        <section class="panel">
          <header class="panel__header">
            <h2>Status</h2>
          </header>
          <article class="status-card">
            <h3>Ready with 1 Warning</h3>
            <p>August UST document missing — report can generate with open exception note.</p>
          </article>

          <footer class="form-actions">
            <button type="button">Preview</button>
            <button type="button">Export PDF</button>
            <button type="button">Send to Customer</button>
          </footer>
        </section>
      </div>
    </section>

    <!-- ========================================================= -->
    <!-- SCREEN 10: CUSTOMER PORTAL                                -->
    <!-- ========================================================= -->
    <section
      id="screen-10-customer-portal"
      class="screen screen--customer-portal"
      data-screen="customer-portal"
      aria-labelledby="screen-10-title"
    >
      <header class="screen__header">
        <div class="screen__eyebrow">Screen 10</div>
        <h1 id="screen-10-title" class="screen__title">Customer Portal</h1>
        <p class="screen__subtitle">Simple client-facing status page with readiness, events, and downloadable reports.</p>
      </header>

      <article class="portal-shell">
        <header class="portal-header">
          <div>
            <h2>My Generator Status</h2>
            <p>Carter Residence</p>
          </div>
          <div class="portal-plan">Plan: Plus+ Monitoring</div>
        </header>

        <div class="screen__grid screen__grid--stack">
          <section class="panel">
            <header class="panel__header">
              <h3>Current Status</h3>
            </header>
            <dl class="detail-list">
              <div><dt>Status</dt><dd>Green — Generator online</dd></div>
              <div><dt>Last Check-In</dt><dd>Today 07:42</dd></div>
              <div><dt>Last Service Visit</dt><dd>08/14/2026</dd></div>
              <div><dt>Next Planned Service</dt><dd>02/14/2027</dd></div>
            </dl>
          </section>

          <section class="panel">
            <header class="panel__header">
              <h3>Recent Events</h3>
            </header>
            <ul class="timeline">
              <li>08/22 — Battery weakness alert</li>
              <li>08/22 — Alert cleared</li>
              <li>08/14 — Semi-annual service completed</li>
            </ul>
          </section>

          <section class="panel">
            <header class="panel__header">
              <h3>Documents</h3>
            </header>
            <div class="document-actions">
              <button type="button">Download latest service report</button>
              <button type="button">Download monthly status report</button>
              <button type="button">View service history</button>
            </div>
          </section>

          <section class="panel">
            <header class="panel__header">
              <h3>Recommendation</h3>
            </header>
            <p>Replace battery at next visit.</p>
          </section>
        </div>
      </article>
    </section>
  </main>
</body>
</html>
```
