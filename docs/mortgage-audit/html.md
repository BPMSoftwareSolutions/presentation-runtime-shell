```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mortgage Audit Storyboard Demo</title>
  </head>
  <body>
    <main id="storyboard-demo">
      <header id="demo-header">
        <h1>From Messy Loan File to Audit-Ready Closing Package</h1>
        <p>
          Interactive storyboard demo for mortgage closing document organization,
          separation, and audit readiness.
        </p>
      </header>

      <nav id="scene-navigation" aria-label="Storyboard scenes">
        <button type="button" data-target="scene-1">1. Messy Intake</button>
        <button type="button" data-target="scene-2">2. Identity + Classification</button>
        <button type="button" data-target="scene-3">3. Used in Closing?</button>
        <button type="button" data-target="scene-4">4. Separation of Record</button>
        <button type="button" data-target="scene-5">5. Audit Report</button>
      </nav>

      <section id="demo-shell" aria-label="Storyboard presentation area">
        <article id="scene-1" class="scene" data-scene="1">
          <header>
            <p>Scene 1</p>
            <h2>Messy Loan File Intake</h2>
            <p>
              Everything is in one place, but nothing is clearly separated.
            </p>
          </header>

          <section aria-labelledby="scene-1-folder-title">
            <h3 id="scene-1-folder-title">Incoming Loan Folder</h3>
            <div class="loan-folder">
              <h4>Loan #48291</h4>
              <ul>
                <li>Closing Disclosure FINAL.pdf</li>
                <li>Closing Disclosure revised.pdf</li>
                <li>Borrower ID.pdf</li>
                <li>Note_signed.pdf</li>
                <li>Note_unsigned.pdf</li>
                <li>Title Commitment.pdf</li>
                <li>Wiring Instructions OLD.pdf</li>
                <li>Payoff Letter.pdf</li>
                <li>Escrow Worksheet.pdf</li>
                <li>Misc Addendum draft.pdf</li>
                <li>Compliance Notice.pdf</li>
                <li>Random Scan 003.pdf</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="scene-1-risk-title">
            <h3 id="scene-1-risk-title">Audit / Risk Question</h3>
            <ul>
              <li>Which documents were actually used to close?</li>
              <li>Which documents were inactive or ancillary?</li>
              <li>Which versions were final?</li>
              <li>Can this be proven quickly during an audit?</li>
            </ul>
          </section>
        </article>

        <article id="scene-2" class="scene" data-scene="2" hidden>
          <header>
            <p>Scene 2</p>
            <h2>Document Identity and Classification</h2>
            <p>
              The system assigns identity, recognizes type, and groups likely duplicates.
            </p>
          </header>

          <section aria-labelledby="scene-2-flow-title">
            <h3 id="scene-2-flow-title">Processing Flow</h3>
            <ol>
              <li>Ingest uploaded loan file documents</li>
              <li>Classify document type</li>
              <li>Assign document IDs</li>
              <li>Group duplicates and versions</li>
              <li>Prepare review-ready statuses</li>
            </ol>
          </section>

          <section aria-labelledby="scene-2-tagged-title">
            <h3 id="scene-2-tagged-title">Tagged Document Stack</h3>
            <ul>
              <li><strong>DISC-CD-V2</strong> — Closing Disclosure revised.pdf — Disclosure</li>
              <li><strong>DISC-CD-V3</strong> — Closing Disclosure FINAL.pdf — Disclosure</li>
              <li><strong>NOTE-V1</strong> — Note_unsigned.pdf — Note</li>
              <li><strong>NOTE-V2</strong> — Note_signed.pdf — Note</li>
              <li><strong>TITLE-01</strong> — Title Commitment.pdf — Title</li>
              <li><strong>PAYOFF-01</strong> — Payoff Letter.pdf — Payoff</li>
              <li><strong>ANC-ESC-01</strong> — Escrow Worksheet.pdf — Ancillary</li>
              <li><strong>ANC-MISC-01</strong> — Misc Addendum draft.pdf — Ancillary</li>
            </ul>
          </section>

          <section aria-labelledby="scene-2-groups-title">
            <h3 id="scene-2-groups-title">Duplicate / Version Groups</h3>
            <ul>
              <li>Closing Disclosure — 2 versions found</li>
              <li>Note — signed and unsigned versions found</li>
              <li>Wiring Instructions — possible outdated version detected</li>
            </ul>
          </section>
        </article>

        <article id="scene-3" class="scene" data-scene="3" hidden>
          <header>
            <p>Scene 3</p>
            <h2>Used in Closing?</h2>
            <p>
              The reviewer confirms what actually mattered in the closing.
            </p>
          </header>

          <section aria-labelledby="scene-3-review-title">
            <h3 id="scene-3-review-title">Review Queue</h3>

            <article class="review-card">
              <h4>Closing Disclosure</h4>
              <p>Versions found: 2</p>
              <form>
                <fieldset>
                  <legend>Select the version used in closing</legend>
                  <label>
                    <input type="radio" name="closing-disclosure" />
                    V2 — revised, older, not final
                  </label>
                  <label>
                    <input type="radio" name="closing-disclosure" checked />
                    V3 — final, signed, used in closing
                  </label>
                </fieldset>
                <div>
                  <button type="button">Mark as Used in Closing</button>
                  <button type="button">Archive Other Version</button>
                </div>
              </form>
            </article>

            <article class="review-card">
              <h4>Note</h4>
              <p>Versions found: 2</p>
              <form>
                <fieldset>
                  <legend>Select the version used in closing</legend>
                  <label>
                    <input type="radio" name="note-version" />
                    V1 — unsigned
                  </label>
                  <label>
                    <input type="radio" name="note-version" checked />
                    V2 — signed, final
                  </label>
                </fieldset>
                <div>
                  <button type="button">Mark as Used in Closing</button>
                  <button type="button">Supersede Unsigned</button>
                </div>
              </form>
            </article>
          </section>

          <section aria-labelledby="scene-3-board-title">
            <h3 id="scene-3-board-title">Status Board</h3>
            <div class="status-board">
              <section>
                <h4>Used in Closing</h4>
                <ul>
                  <li>Closing Disclosure</li>
                  <li>Note</li>
                  <li>Payoff Letter</li>
                  <li>Title Commitment</li>
                </ul>
              </section>
              <section>
                <h4>Not Used / Ancillary</h4>
                <ul>
                  <li>Escrow Worksheet</li>
                  <li>Misc Addendum draft</li>
                  <li>Compliance Notice</li>
                </ul>
              </section>
              <section>
                <h4>Needs Review</h4>
                <ul>
                  <li>Wiring Instructions OLD</li>
                  <li>Random Scan 003</li>
                </ul>
              </section>
            </div>
          </section>
        </article>

        <article id="scene-4" class="scene" data-scene="4" hidden>
          <header>
            <p>Scene 4</p>
            <h2>Separation of Record</h2>
            <p>
              The system produces a clean closing package and a separate inactive archive.
            </p>
          </header>

          <section aria-labelledby="scene-4-routing-title">
            <h3 id="scene-4-routing-title">Finalized File Routing</h3>
            <div class="routing-layout">
              <section>
                <h4>Closing Package</h4>
                <ul>
                  <li>Closing Disclosure</li>
                  <li>Signed Note</li>
                  <li>Payoff Letter</li>
                  <li>Title Commitment</li>
                </ul>
              </section>

              <section>
                <h4>Inactive / Ancillary Archive</h4>
                <ul>
                  <li>Escrow Worksheet</li>
                  <li>Draft Addendum</li>
                  <li>Compliance Notice</li>
                </ul>
              </section>

              <section>
                <h4>Exceptions / Policy Review</h4>
                <ul>
                  <li>Wiring Instructions OLD</li>
                  <li>Random Scan 003</li>
                </ul>
              </section>
            </div>
          </section>

          <section aria-labelledby="scene-4-actions-title">
            <h3 id="scene-4-actions-title">Primary Action</h3>
            <button type="button" id="generate-audit-report">
              Generate Audit Report
            </button>
          </section>
        </article>

        <article id="scene-5" class="scene" data-scene="5" hidden>
          <header>
            <p>Scene 5</p>
            <h2>Audit-Ready in One Click</h2>
            <p>
              At any moment, the file can explain what was used, what was excluded, and why.
            </p>
          </header>

          <section aria-labelledby="scene-5-summary-title">
            <h3 id="scene-5-summary-title">Loan #48291 Audit Summary</h3>
            <dl>
              <div>
                <dt>Total documents received</dt>
                <dd>12</dd>
              </div>
              <div>
                <dt>Used in closing</dt>
                <dd>4</dd>
              </div>
              <div>
                <dt>Archived as inactive / ancillary</dt>
                <dd>3</dd>
              </div>
              <div>
                <dt>Superseded / duplicate</dt>
                <dd>3</dd>
              </div>
              <div>
                <dt>Exceptions reviewed</dt>
                <dd>2</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>Audit-Ready</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="scene-5-report-title">
            <h3 id="scene-5-report-title">Audit Report</h3>
            <article>
              <h4>Closing Documents (Used)</h4>
              <ul>
                <li>Closing Disclosure (final signed)</li>
                <li>Note (signed)</li>
                <li>Payoff Letter</li>
                <li>Title Commitment</li>
              </ul>
            </article>

            <article>
              <h4>Excluded / Inactive</h4>
              <ul>
                <li>Escrow Worksheet — ancillary</li>
                <li>Addendum draft — not used</li>
                <li>Compliance Notice — informational</li>
              </ul>
            </article>

            <article>
              <h4>Superseded</h4>
              <ul>
                <li>Closing Disclosure V2 — replaced by final</li>
                <li>Unsigned Note — replaced by signed version</li>
              </ul>
            </article>

            <article>
              <h4>Exceptions Reviewed</h4>
              <ul>
                <li>Wiring Instructions OLD — flagged and reviewed</li>
              </ul>
            </article>
          </section>

          <section aria-labelledby="scene-5-filters-title">
            <h3 id="scene-5-filters-title">Optional Drill-Down Filters</h3>
            <form id="audit-filters">
              <label>
                Document Type
                <select name="document-type">
                  <option value="all">All</option>
                  <option value="disclosure">Disclosure</option>
                  <option value="note">Note</option>
                  <option value="title">Title</option>
                  <option value="payoff">Payoff</option>
                  <option value="ancillary">Ancillary</option>
                </select>
              </label>

              <label>
                Status
                <select name="status">
                  <option value="all">All</option>
                  <option value="used">Used in Closing</option>
                  <option value="inactive">Inactive / Ancillary</option>
                  <option value="superseded">Superseded</option>
                  <option value="exceptions">Exceptions</option>
                </select>
              </label>

              <label>
                Date
                <select name="date-range">
                  <option value="all">All Dates</option>
                  <option value="intake">Intake Date</option>
                  <option value="review">Review Actions</option>
                  <option value="finalized">Finalized Date</option>
                </select>
              </label>

              <label>
                Reviewer
                <select name="reviewer">
                  <option value="all">All Reviewers</option>
                  <option value="roni">Roni</option>
                  <option value="processor">Processor</option>
                  <option value="system">System</option>
                </select>
              </label>
            </form>
          </section>

          <section aria-labelledby="scene-5-questions-title">
            <h3 id="scene-5-questions-title">Quick Audit Questions</h3>
            <div class="quick-actions">
              <button type="button">Show Excluded Documents</button>
              <button type="button">Show Final Signed Versions</button>
              <button type="button">Show All Disclosures</button>
              <button type="button">Show Decision History</button>
            </div>
          </section>

          <section aria-labelledby="scene-5-timeline-title">
            <h3 id="scene-5-timeline-title">Timeline / Chain of Custody</h3>
            <ol>
              <li>09:14 AM — Documents ingested</li>
              <li>09:15 AM — System classified documents</li>
              <li>09:17 AM — Duplicate groups created</li>
              <li>09:21 AM — Closing Disclosure V3 marked as final</li>
              <li>09:22 AM — Unsigned Note marked superseded</li>
              <li>09:24 AM — Ancillary documents separated</li>
              <li>09:25 AM — Audit-ready closing package generated</li>
            </ol>
          </section>
        </article>
      </section>

      <footer id="demo-footer">
        <p>
          Demo focus: classify, separate, verify, and prove what was used in closing.
        </p>
      </footer>
    </main>

    <script>
      const sceneButtons = document.querySelectorAll('[data-target]');
      const scenes = document.querySelectorAll('.scene');

      function showScene(sceneId) {
        scenes.forEach((scene) => {
          scene.hidden = scene.id !== sceneId;
        });
      }

      sceneButtons.forEach((button) => {
        button.addEventListener('click', () => {
          showScene(button.dataset.target);
        });
      });

      const generateAuditReportButton = document.getElementById('generate-audit-report');
      if (generateAuditReportButton) {
        generateAuditReportButton.addEventListener('click', () => {
          showScene('scene-5');
        });
      }
    </script>
  </body>
</html>
```

I created the **HTML-only storyboard structure** in the canvas, with:

## Included

* **5 scenes** for the full demo flow
* **semantic HTML structure**
* **navigation buttons** for jumping between scenes
* a basic **scene-switching script**
* the **Generate Audit Report** action wired to Scene 5
* the **filters section** included in the audit scene
* **quick audit questions** and **timeline / chain of custody**

## Current state

There’s **no CSS yet**, so it’s purely structural and ready for styling next.
