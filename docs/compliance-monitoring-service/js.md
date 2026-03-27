Here’s a **single JavaScript runtime** for the 10-screen demo.

It is built to work with the HTML scaffold you already have and gives you:

* scene navigation for all 10 screens
* autoplay support
* keyboard controls
* per-screen scripted interactions
* lightweight number counting / typing / reveal effects
* `iframe:ready`, `scene:change`, and `scene:complete` events via both `postMessage` and DOM events

```javascript
(function () {
  "use strict";

  const DemoRuntime = (() => {
    const SELECTORS = {
      screens: ".screen",
      screenTitle: ".screen__title",
      buttons: "button",
      inputs: "input, select, textarea",
      panels: ".panel, .summary-card, .status-card, .decision-card, .form-section",
      tables: ".data-table tbody tr",
      tabButtons: ".tab-nav button",
    };

    const DEFAULTS = {
      autoplay: true,
      autoplayDelay: 900,
      sceneDuration: 5200,
      startScene: 0,
      loop: true,
      debug: false,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    };

    const state = {
      config: { ...DEFAULTS },
      screens: [],
      currentIndex: 0,
      autoplayTimer: null,
      sceneTimer: null,
      started: false,
      paused: false,
    };

    const SCREEN_CONFIG = [
      { id: "screen-01-operations-dashboard", duration: 4600, run: runDashboardScene },
      { id: "screen-02-customer-profile", duration: 4800, run: runCustomerProfileScene },
      { id: "screen-03-customer-onboarding", duration: 5400, run: runOnboardingScene },
      { id: "screen-04-service-report", duration: 5600, run: runServiceReportScene },
      { id: "screen-05-monitoring-center", duration: 5200, run: runMonitoringScene },
      { id: "screen-06-compliance-tracker", duration: 5000, run: runComplianceScene },
      { id: "screen-07-load-bank-decision", duration: 4600, run: runLoadBankScene },
      { id: "screen-08-monthly-report-generator", duration: 5000, run: runMonthlyReportScene },
      { id: "screen-09-annual-compliance-report", duration: 4800, run: runAnnualReportScene },
      { id: "screen-10-customer-portal", duration: 4600, run: runPortalScene },
    ];

    function init(userConfig = {}) {
      state.config = { ...DEFAULTS, ...userConfig };
      state.screens = Array.from(document.querySelectorAll(SELECTORS.screens));

      if (!state.screens.length) {
        warn("No screens found.");
        return;
      }

      injectRuntimeStyles();
      prepareScreens();
      bindGlobalControls();
      bindHoverPause();

      state.currentIndex = clamp(state.config.startScene, 0, state.screens.length - 1);

      goTo(state.currentIndex, { immediate: true, emit: false });

      emitReady();

      if (state.config.autoplay) {
        state.autoplayTimer = setTimeout(() => start(), state.config.autoplayDelay);
      }
    }

    function start() {
      if (state.started) return;
      state.started = true;
      playCurrentScene();
    }

    function pause() {
      state.paused = true;
      clearTimers();
      document.documentElement.setAttribute("data-demo-paused", "true");
      emit("demo:paused", {
        index: state.currentIndex,
        screenId: getCurrentScreen()?.id,
      });
    }

    function resume() {
      if (!state.paused) return;
      state.paused = false;
      document.documentElement.removeAttribute("data-demo-paused");
      emit("demo:resumed", {
        index: state.currentIndex,
        screenId: getCurrentScreen()?.id,
      });
      playCurrentScene();
    }

    function next() {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.screens.length) {
        if (state.config.loop) {
          goTo(0);
        } else {
          clearTimers();
          emit("demo:finished", { index: state.currentIndex });
        }
        return;
      }
      goTo(nextIndex);
    }

    function prev() {
      const prevIndex = state.currentIndex - 1;
      if (prevIndex < 0) {
        if (state.config.loop) {
          goTo(state.screens.length - 1);
        }
        return;
      }
      goTo(prevIndex);
    }

    function goTo(index, opts = {}) {
      const { immediate = false, emit: shouldEmit = true } = opts;

      clearTimers();
      state.currentIndex = clamp(index, 0, state.screens.length - 1);

      state.screens.forEach((screen, i) => {
        const active = i === state.currentIndex;
        resetScreenState(screen);
        screen.hidden = !active;
        screen.setAttribute("aria-hidden", String(!active));
        screen.dataset.active = String(active);

        if (active) {
          screen.classList.add("is-active");
          if (!immediate) {
            animateIn(screen);
          }
        } else {
          screen.classList.remove("is-active");
        }
      });

      const currentScreen = getCurrentScreen();
      if (!currentScreen) return;

      if (shouldEmit) {
        emit("scene:change", {
          index: state.currentIndex,
          screenId: currentScreen.id,
          title: getScreenTitle(currentScreen),
        });
      }

      if (state.started && !state.paused) {
        playCurrentScene();
      }
    }

    function playCurrentScene() {
      clearTimers();

      const screen = getCurrentScreen();
      if (!screen) return;

      const cfg = SCREEN_CONFIG[state.currentIndex] || {};
      const duration = cfg.duration || state.config.sceneDuration;

      markSceneProgress(screen, 0);

      if (typeof cfg.run === "function") {
        cfg.run(screen, {
          duration,
          onProgress: (value) => markSceneProgress(screen, value),
        });
      }

      state.sceneTimer = setTimeout(() => {
        markSceneProgress(screen, 1);
        emit("scene:complete", {
          index: state.currentIndex,
          screenId: screen.id,
          title: getScreenTitle(screen),
        });
        next();
      }, duration);
    }

    function clearTimers() {
      clearTimeout(state.autoplayTimer);
      clearTimeout(state.sceneTimer);
    }

    function prepareScreens() {
      document.body.setAttribute("data-demo-runtime", "generator-command-center");

      state.screens.forEach((screen, index) => {
        screen.hidden = true;
        screen.setAttribute("aria-hidden", "true");
        screen.dataset.index = String(index);

        const title = screen.querySelector(SELECTORS.screenTitle);
        if (title) {
          title.dataset.originalText = title.textContent;
        }

        const panels = Array.from(screen.querySelectorAll(SELECTORS.panels));
        panels.forEach((panel, panelIndex) => {
          panel.style.setProperty("--demo-stagger", String(panelIndex));
        });
      });
    }

    function resetScreenState(screen) {
      stopAllTypewriters(screen);

      screen.querySelectorAll("[data-demo-temp]").forEach((el) => {
        el.remove();
      });

      screen.querySelectorAll("[data-demo-highlight]").forEach((el) => {
        el.removeAttribute("data-demo-highlight");
      });

      screen.querySelectorAll("[data-demo-active]").forEach((el) => {
        el.removeAttribute("data-demo-active");
      });

      screen.querySelectorAll("[data-demo-complete]").forEach((el) => {
        el.removeAttribute("data-demo-complete");
      });

      screen.querySelectorAll("[data-demo-selected]").forEach((el) => {
        el.removeAttribute("data-demo-selected");
      });

      screen.querySelectorAll("[data-demo-filled]").forEach((el) => {
        el.removeAttribute("data-demo-filled");
      });

      screen.querySelectorAll("[data-demo-hidden]").forEach((el) => {
        el.removeAttribute("data-demo-hidden");
      });

      screen.querySelectorAll(".demo-runtime-reveal").forEach((el) => {
        el.classList.remove("demo-runtime-reveal", "demo-runtime-reveal--visible");
      });

      screen.querySelectorAll(".demo-runtime-pulse").forEach((el) => {
        el.classList.remove("demo-runtime-pulse");
      });

      screen.querySelectorAll(".demo-runtime-focus").forEach((el) => {
        el.classList.remove("demo-runtime-focus");
      });

      screen.querySelectorAll(".demo-runtime-success").forEach((el) => {
        el.classList.remove("demo-runtime-success");
      });

      screen.querySelectorAll(".demo-runtime-warning").forEach((el) => {
        el.classList.remove("demo-runtime-warning");
      });

      screen.querySelectorAll(".demo-runtime-alert").forEach((el) => {
        el.classList.remove("demo-runtime-alert");
      });

      screen.querySelectorAll("input, textarea").forEach((input) => {
        if (input.dataset.originalValue !== undefined) {
          input.value = input.dataset.originalValue;
        } else {
          input.dataset.originalValue = input.value;
        }
      });

      screen.querySelectorAll("select").forEach((select) => {
        if (select.dataset.originalIndex !== undefined) {
          select.selectedIndex = Number(select.dataset.originalIndex);
        } else {
          select.dataset.originalIndex = String(select.selectedIndex);
        }
      });

      screen.querySelectorAll("input[type='checkbox'], input[type='radio']").forEach((input) => {
        if (input.dataset.originalChecked !== undefined) {
          input.checked = input.dataset.originalChecked === "true";
        } else {
          input.dataset.originalChecked = String(input.checked);
        }
      });

      const title = screen.querySelector(SELECTORS.screenTitle);
      if (title && title.dataset.originalText) {
        title.textContent = title.dataset.originalText;
      }

      markSceneProgress(screen, 0);
    }

    function animateIn(screen) {
      if (state.config.reducedMotion) return;
      const blocks = screen.querySelectorAll(
        ".screen__header, .screen__toolbar, .summary-strip, .panel, .customer-profile, .portal-shell, .form-section"
      );
      blocks.forEach((el, i) => {
        el.animate(
          [
            { opacity: 0, transform: "translateY(18px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 380,
            delay: i * 45,
            easing: "cubic-bezier(.2,.8,.2,1)",
            fill: "both",
          }
        );
      });
    }

    function bindGlobalControls() {
      window.addEventListener("keydown", (event) => {
        switch (event.key) {
          case "ArrowRight":
          case "PageDown":
          case " ":
            event.preventDefault();
            next();
            break;
          case "ArrowLeft":
          case "PageUp":
            event.preventDefault();
            prev();
            break;
          case "Home":
            event.preventDefault();
            goTo(0);
            break;
          case "End":
            event.preventDefault();
            goTo(state.screens.length - 1);
            break;
          case "p":
          case "P":
            event.preventDefault();
            state.paused ? resume() : pause();
            break;
        }
      });

      window.addEventListener("message", (event) => {
        const data = event.data || {};
        if (!data || typeof data !== "object") return;

        switch (data.type) {
          case "demo:next":
            next();
            break;
          case "demo:prev":
            prev();
            break;
          case "demo:pause":
            pause();
            break;
          case "demo:resume":
            resume();
            break;
          case "demo:goto":
            if (typeof data.index === "number") goTo(data.index);
            break;
        }
      });
    }

    function bindHoverPause() {
      document.addEventListener("mouseenter", () => {
        if (state.started) pause();
      }, true);

      document.addEventListener("mouseleave", () => {
        if (state.started) resume();
      }, true);
    }

    function getCurrentScreen() {
      return state.screens[state.currentIndex] || null;
    }

    function getScreenTitle(screen) {
      return screen?.querySelector(SELECTORS.screenTitle)?.textContent?.trim() || "";
    }

    function emitReady() {
      emit("iframe:ready", {
        demo: "generator-command-center",
        screens: state.screens.map((screen, index) => ({
          index,
          id: screen.id,
          title: getScreenTitle(screen),
        })),
      });
    }

    function emit(type, detail = {}) {
      document.dispatchEvent(new CustomEvent(type, { detail }));

      try {
        window.parent?.postMessage({ type, detail }, "*");
      } catch (error) {
        warn("postMessage failed", error);
      }

      debug(type, detail);
    }

    function markSceneProgress(screen, progress) {
      screen.style.setProperty("--scene-progress", String(progress));
    }

    function injectRuntimeStyles() {
      if (document.getElementById("demo-runtime-styles")) return;

      const style = document.createElement("style");
      style.id = "demo-runtime-styles";
      style.textContent = `
        html, body {
          scroll-behavior: auto !important;
          overflow: hidden;
        }

        [data-demo-runtime="generator-command-center"] .screen {
          opacity: 0;
          pointer-events: none;
          transform: translateY(8px) scale(0.995);
          transition:
            opacity 320ms ease,
            transform 420ms cubic-bezier(.2,.8,.2,1);
        }

        [data-demo-runtime="generator-command-center"] .screen.is-active {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0) scale(1);
        }

        [data-demo-runtime="generator-command-center"] .panel,
        [data-demo-runtime="generator-command-center"] .summary-card,
        [data-demo-runtime="generator-command-center"] .status-card,
        [data-demo-runtime="generator-command-center"] .decision-card,
        [data-demo-runtime="generator-command-center"] .form-section {
          position: relative;
        }

        [data-demo-highlight="true"],
        .demo-runtime-focus {
          outline: 2px solid rgba(99, 102, 241, 0.95);
          outline-offset: 3px;
          box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.12);
        }

        .demo-runtime-pulse {
          animation: demoRuntimePulse 1.4s ease-in-out infinite;
        }

        .demo-runtime-success {
          outline: 2px solid rgba(16, 185, 129, 0.95);
          outline-offset: 3px;
          box-shadow: 0 0 0 8px rgba(16, 185, 129, 0.12);
        }

        .demo-runtime-warning {
          outline: 2px solid rgba(245, 158, 11, 0.95);
          outline-offset: 3px;
          box-shadow: 0 0 0 8px rgba(245, 158, 11, 0.12);
        }

        .demo-runtime-alert {
          outline: 2px solid rgba(239, 68, 68, 0.95);
          outline-offset: 3px;
          box-shadow: 0 0 0 8px rgba(239, 68, 68, 0.12);
        }

        [data-demo-selected="true"] {
          background: rgba(99, 102, 241, 0.12) !important;
        }

        .demo-runtime-reveal {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 260ms ease, transform 260ms ease;
        }

        .demo-runtime-reveal--visible {
          opacity: 1;
          transform: translateY(0);
        }

        [data-demo-runtime-progress] {
          position: fixed;
          left: 0;
          right: 0;
          top: 0;
          height: 4px;
          z-index: 9999;
          background: rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        [data-demo-runtime-progress]::after {
          content: "";
          display: block;
          width: calc(var(--scene-progress, 0) * 100%);
          height: 100%;
          background: linear-gradient(90deg, #22d3ee, #818cf8, #10b981);
          transition: width 180ms linear;
        }

        @keyframes demoRuntimePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.01); }
        }
      `;
      document.head.appendChild(style);

      const progress = document.createElement("div");
      progress.setAttribute("data-demo-runtime-progress", "true");
      document.body.appendChild(progress);

      const syncProgress = () => {
        const active = getCurrentScreen();
        const progressValue = active?.style.getPropertyValue("--scene-progress") || "0";
        progress.style.setProperty("--scene-progress", progressValue);
        requestAnimationFrame(syncProgress);
      };
      syncProgress();
    }

    function typeText(el, text, speed = 18) {
      if (!el) return Promise.resolve();
      stopTypewriter(el);
      const original = el.textContent;
      el.dataset.originalText = el.dataset.originalText || original;
      el.textContent = "";

      return new Promise((resolve) => {
        let index = 0;
        const interval = setInterval(() => {
          el.textContent = text.slice(0, index + 1);
          index += 1;
          if (index >= text.length) {
            clearInterval(interval);
            delete el.__typeInterval;
            resolve();
          }
        }, state.config.reducedMotion ? 0 : speed);
        el.__typeInterval = interval;
      });
    }

    function stopTypewriter(el) {
      if (el && el.__typeInterval) {
        clearInterval(el.__typeInterval);
        delete el.__typeInterval;
      }
    }

    function stopAllTypewriters(root) {
      root.querySelectorAll("*").forEach((el) => stopTypewriter(el));
    }

    function countNumber(el, from, to, duration = 900, suffix = "") {
      if (!el) return;
      const startTime = performance.now();

      const tick = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = Math.round(from + (to - from) * eased);
        el.textContent = `${value}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }

    function fillInput(input, value, charDelay = 20) {
      if (!input) return Promise.resolve();

      if (input.tagName === "SELECT") {
        const index = Array.from(input.options).findIndex((opt) => opt.textContent.trim() === value);
        if (index >= 0) input.selectedIndex = index;
        input.dataset.demoFilled = "true";
        input.dispatchEvent(new Event("change", { bubbles: true }));
        return Promise.resolve();
      }

      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = Boolean(value);
        input.dataset.demoFilled = "true";
        input.dispatchEvent(new Event("change", { bubbles: true }));
        return Promise.resolve();
      }

      input.value = "";
      input.focus();
      input.classList.add("demo-runtime-focus");

      return new Promise((resolve) => {
        let i = 0;
        const chars = String(value).split("");
        const interval = setInterval(() => {
          input.value += chars[i];
          i += 1;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          if (i >= chars.length) {
            clearInterval(interval);
            input.classList.remove("demo-runtime-focus");
            input.dataset.demoFilled = "true";
            resolve();
          }
        }, state.config.reducedMotion ? 0 : charDelay);
        input.__typeInterval = interval;
      });
    }

    function highlight(el, className = "demo-runtime-focus", duration = 1000) {
      if (!el) return;
      el.classList.add(className);
      setTimeout(() => el.classList.remove(className), duration);
    }

    function clickPulse(el) {
      if (!el) return;
      el.classList.add("demo-runtime-pulse");
      setTimeout(() => el.classList.remove("demo-runtime-pulse"), 1200);
    }

    function reveal(el, delay = 0) {
      if (!el) return;
      el.classList.add("demo-runtime-reveal");
      setTimeout(() => el.classList.add("demo-runtime-reveal--visible"), delay);
    }

    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function debug(...args) {
      if (state.config.debug) {
        console.log("[DemoRuntime]", ...args);
      }
    }

    function warn(...args) {
      console.warn("[DemoRuntime]", ...args);
    }

    // ---------------------------------------------------------------------
    // Screen scripts
    // ---------------------------------------------------------------------

    async function runDashboardScene(screen, ctx) {
      const summaryCards = Array.from(screen.querySelectorAll(".summary-card p"));
      const targets = [3, 2, 1, 4];

      summaryCards.forEach((el, i) => {
        const currentText = el.textContent;
        const label = currentText.replace(/\d+/g, "").trim();
        el.textContent = "0";
        setTimeout(() => {
          countNumber(el, 0, targets[i], 900);
          setTimeout(() => {
            el.textContent = `${targets[i]} ${label}`;
          }, 920);
        }, i * 140);
      });

      await wait(800);

      const alerts = screen.querySelectorAll(".alert");
      alerts.forEach((alert, i) => {
        setTimeout(() => highlight(alert, i === 0 ? "demo-runtime-alert" : "demo-runtime-warning", 1200), i * 380);
      });

      await wait(1300);

      const kpis = Array.from(screen.querySelectorAll(".panel--kpis dd"));
      const values = [12, 7, 18, 2];
      kpis.forEach((dd, i) => {
        dd.textContent = "0";
        setTimeout(() => countNumber(dd, 0, values[i], 850), i * 100);
      });

      simulateProgress(ctx.duration, ctx.onProgress);
    }

    async function runCustomerProfileScene(screen, ctx) {
      const tabButtons = Array.from(screen.querySelectorAll(".tab-nav button"));
      const activityItems = Array.from(screen.querySelectorAll(".timeline li"));

      for (let i = 0; i < tabButtons.length; i += 1) {
        tabButtons.forEach((btn) => btn.removeAttribute("aria-current"));
        tabButtons[i].setAttribute("aria-current", "page");
        clickPulse(tabButtons[i]);
        await wait(420);
      }

      activityItems.forEach((item, i) => {
        setTimeout(() => highlight(item, "demo-runtime-focus", 900), i * 260);
      });

      const complianceRow = Array.from(screen.querySelectorAll(".detail-list dd")).find(
        (dd) => dd.textContent.trim().toLowerCase() === "green"
      );
      if (complianceRow) {
        await wait(900);
        highlight(complianceRow.parentElement, "demo-runtime-success", 1200);
      }

      simulateProgress(ctx.duration, ctx.onProgress);
    }

    async function runOnboardingScene(screen, ctx) {
      const fields = Array.from(screen.querySelectorAll(".onboarding-form input, .onboarding-form select"));
      const map = [
        { label: "Customer Type", value: "Commercial" },
        { label: "Customer Name", value: "Shell Station 184" },
        { label: "Address", value: "1980 Woodward Ave, Birmingham, MI" },
        { label: "Contact Name", value: "Site Manager" },
        { label: "Phone", value: "(555) 555-0198" },
        { label: "Email", value: "manager@shell184.com" },
        { label: "Generator Brand", value: "Kohler" },
        { label: "Size", value: "60kW" },
        { label: "Fuel Type", value: "Diesel" },
        { label: "Transfer Switch", value: "Yes" },
        { label: "Serial Number", value: "KH-60-D-184" },
        { label: "Monitoring Unit", value: "PT Series" },
      ];

      for (const item of map) {
        const field = fields.find((input) => {
          const label = input.closest("label")?.querySelector("span")?.textContent?.trim();
          return label === item.label;
        });
        if (field) {
          await fillInput(field, item.value, 12);
          await wait(80);
        }
      }

      const checkboxes = Array.from(screen.querySelectorAll("input[type='checkbox']"));
      for (let i = 0; i < checkboxes.length; i += 1) {
        checkboxes[i].checked = true;
        highlight(checkboxes[i].closest("label"), "demo-runtime-success", 800);
        await wait(110);
      }

      const saveButton = Array.from(screen.querySelectorAll("button")).find((btn) =>
        /save customer/i.test(btn.textContent)
      );
      if (saveButton) {
        await wait(300);
        clickPulse(saveButton);
      }

      simulateProgress(ctx.duration, ctx.onProgress);
    }

    async function runServiceReportScene(screen, ctx) {
      const sections = screen.querySelectorAll(".form-section");
      sections.forEach((section, i) => setTimeout(() => highlight(section, "demo-runtime-focus", 900), i * 260));

      await wait(700);

      const checkboxes = Array.from(screen.querySelectorAll("input[type='checkbox']"));
      for (let i = 0; i < checkboxes.length; i += 1) {
        checkboxes[i].checked = i < 10 ? true : checkboxes[i].checked;
        const label = checkboxes[i].closest("label");
        if (label) highlight(label, "demo-runtime-success", 620);
        await wait(90);
      }

      const textarea = screen.querySelector("textarea");
      if (textarea) {
        await fillInput(
          textarea,
          "Generator performed normally. Recommend battery replacement during next planned service visit.",
          10
        );
      }

      const finalize = Array.from(screen.querySelectorAll("button")).find((btn) =>
        /finalize report/i.test(btn.textContent)
      );
      if (finalize) {
        await wait(200);
        clickPulse(finalize);
        highlight(finalize, "demo-runtime-success", 1000);
      }

      simulateProgress(ctx.duration, ctx.onProgress);
    }

    async function runMonitoringScene(screen, ctx) {
      const rows = Array.from(screen.querySelectorAll(".data-table tbody tr"));
      const selectedRow = rows[1] || rows[0];
      if (selectedRow) {
        selectedRow.dataset.demoSelected = "true";
        highlight(selectedRow, "demo-runtime-alert", 1300);
      }

      await wait(500);

      const detailPanel = screen.querySelector(".panel--selected-alert");
      if (detailPanel) {
        highlight(detailPanel, "demo-runtime-focus", 1400);
      }

      const tasks = Array.from(screen.querySelectorAll(".task-checklist input[type='checkbox']"));
      for (let i = 0; i < tasks.length; i += 1) {
        tasks[i].checked = true;
        highlight(tasks[i].closest("label"), "demo-runtime-success", 800);
        await wait(180);
      }

      const notes = screen.querySelector(".panel--selected-alert textarea");
      if (notes) {
        await fillInput(notes, "Threshold miss logged. Load bank evaluation added to next service cycle.", 12);
      }

      const createWorkOrder = Array.from(screen.querySelectorAll("button")).find((btn) =>
        /create work order/i.test(btn.textContent)
      );
      if (createWorkOrder) {
        await wait(220);
        clickPulse(createWorkOrder);
      }

      simulateProgress(ctx.duration, ctx.onProgress);
    }

    async function runComplianceScene(screen, ctx) {
      const rows = Array.from(screen.querySelectorAll(".data-table tbody tr"));
      rows.forEach((row, i) => {
        setTimeout(() => {
          if (i === 2) highlight(row, "demo-runtime-warning", 1000);
          else if (i === 3) highlight(row, "demo-runtime-alert", 1200);
          else highlight(row, "demo-runtime-focus", 700);
        }, i * 160);
      });

      await wait(1100);

      const notesPanel = screen.querySelectorAll(".panel")[1];
      if (notesPanel) {
        highlight(notesPanel, "demo-runtime-focus", 1200);
      }

      const exportButton = Array.from(screen.querySelectorAll("button")).find((btn) =>
        /export compliance packet/i.test(btn.textContent)
      );
      if (exportButton) {
        await wait(500);
        clickPulse(exportButton);
        highlight(exportButton, "demo-runtime-success", 1000);
      }

      simulateProgress(ctx.duration, ctx.onProgress);
    }

    async function runLoadBankScene(screen, ctx) {
      const rows = Array.from(screen.querySelectorAll(".data-table tbody tr"));
      const failRows = rows.filter((row) => /no/i.test(row.children[1]?.textContent || ""));
      rows.forEach((row, i) => setTimeout(() => highlight(row, "demo-runtime-focus", 700), i * 130));

      await wait(900);

      failRows.forEach((row, i) => {
        setTimeout(() => highlight(row, "demo-runtime-alert", 1200), i * 280);
      });

      await wait(900);

      const decisionCard = screen.querySelector(".decision-card");
      if (decisionCard) {
        highlight(decisionCard, "demo-runtime-warning", 1400);
      }

      const actions = screen.querySelectorAll(".decision-actions button");
      actions.forEach((btn, i) => setTimeout(() => clickPulse(btn), 200 + i * 220));

      simulateProgress(ctx.duration, ctx.onProgress);
    }

    async function runMonthlyReportScene(screen, ctx) {
      const formPanel = screen.querySelector(".app-form.panel");
      const previewPanel = screen.querySelector(".report-preview");

      if (formPanel) highlight(formPanel, "demo-runtime-focus", 900);
      await wait(400);

      const checks = Array.from(formPanel?.querySelectorAll("input[type='checkbox']") || []);
      checks.forEach((check, i) => {
        setTimeout(() => {
          check.checked = i !== 4 && i !== 5;
          highlight(check.closest("label"), "demo-runtime-success", 700);
        }, i * 120);
      });

      await wait(1200);

      if (previewPanel) {
        reveal(previewPanel, 0);
        highlight(previewPanel, "demo-runtime-success", 1200);
      }

      const generate = Array.from(screen.querySelectorAll("button")).find((btn) =>
        /generate pdf/i.test(btn.textContent)
      );
      if (generate) {
        await wait(500);
        clickPulse(generate);
      }

      simulateProgress(ctx.duration, ctx.onProgress);
    }

    async function runAnnualReportScene(screen, ctx) {
      const panels = screen.querySelectorAll(".panel");
      panels.forEach((panel, i) => setTimeout(() => highlight(panel, "demo-runtime-focus", 900), i * 280));

      await wait(900);

      const warningCard = screen.querySelector(".status-card");
      if (warningCard) {
        highlight(warningCard, "demo-runtime-warning", 1500);
      }

      const buttons = Array.from(screen.querySelectorAll("button"));
      const preview = buttons.find((btn) => /preview/i.test(btn.textContent));
      const exportBtn = buttons.find((btn) => /export pdf/i.test(btn.textContent));

      if (preview) {
        await wait(500);
        clickPulse(preview);
      }

      if (exportBtn) {
        await wait(500);
        clickPulse(exportBtn);
        highlight(exportBtn, "demo-runtime-success", 1200);
      }

      simulateProgress(ctx.duration, ctx.onProgress);
    }

    async function runPortalScene(screen, ctx) {
      const panels = Array.from(screen.querySelectorAll(".panel"));
      panels.forEach((panel, i) => setTimeout(() => highlight(panel, "demo-runtime-focus", 850), i * 220));

      await wait(800);

      const statusLine = Array.from(screen.querySelectorAll(".detail-list dd")).find((dd) =>
        /green/i.test(dd.textContent)
      );
      if (statusLine) {
        highlight(statusLine.parentElement, "demo-runtime-success", 1200);
      }

      const docButtons = Array.from(screen.querySelectorAll(".document-actions button"));
      for (let i = 0; i < docButtons.length; i += 1) {
        clickPulse(docButtons[i]);
        await wait(260);
      }

      simulateProgress(ctx.duration, ctx.onProgress);
    }

    function simulateProgress(duration, onProgress) {
      const start = performance.now();

      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        onProgress?.(p);
        if (p < 1 && !state.paused) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    }

    return {
      init,
      start,
      pause,
      resume,
      next,
      prev,
      goTo,
      state,
    };
  })();

  window.GeneratorDemo = DemoRuntime;

  document.addEventListener("DOMContentLoaded", () => {
    DemoRuntime.init({
      autoplay: true,
      sceneDuration: 5200,
      loop: true,
      debug: false,
    });
  });
})();
```

## How to use it

Add this at the bottom of your HTML, just before `</body>`:

```html
<script src="generator-demo.js"></script>
```

If you want inline instead, wrap the JS above in:

```html
<script>
  /* JS here */
</script>
```

## Runtime controls

Once loaded, you can also control it manually:

```javascript
window.GeneratorDemo.next();
window.GeneratorDemo.prev();
window.GeneratorDemo.goTo(4); // goes to screen 5
window.GeneratorDemo.pause();
window.GeneratorDemo.resume();
```

## Events emitted

The script emits both DOM events and `postMessage` messages for:

```javascript
iframe:ready
scene:change
scene:complete
demo:paused
demo:resumed
demo:finished
```

Example listener:

```javascript
document.addEventListener("scene:change", (event) => {
  console.log(event.detail);
});
```
