/**
 * DEMO ENGINE - Global Demo Controller
 * Orchestrates cinematic 10-screen experience
 * Signal → Context → Decision → Action → Proof
 */

window.DEMO = {
  // ─── STATE ─────────────────────────────────────────
  step: 0,
  auto: true,
  maxSteps: 0,
  currentScene: null,
  sceneDemos: {},
  narrationPanel: null,
  
  // ─── CONFIGURATION ─────────────────────────────────
  autoPlayDelay: 3000, // ms between auto steps
  narrationSpeed: 50,  // ms per character
  highlightColor: 'rgba(34,211,238,0.6)',
  
  // ─── INITIALIZATION ────────────────────────────────
  init(sceneKey, demoFlow) {
    DEMO.currentScene = sceneKey;
    DEMO.sceneDemos[sceneKey] = demoFlow;
    DEMO.maxSteps = demoFlow.steps.length;
    DEMO.step = 0;
    
    // Create narration panel
    DEMO.createNarrationPanel();
    
    // Show intro narration
    if (demoFlow.intro) {
      DEMO.narrate(demoFlow.intro);
    }
    
    // Start auto-play if enabled
    if (DEMO.auto) {
      DEMO.scheduleNext();
    }
  },
  
  // ─── NARRATION LAYER ───────────────────────────────
  createNarrationPanel() {
    const panel = document.createElement('div');
    panel.id = 'demo-narration';
    panel.innerHTML = `
      <div class="demo-narration-content">
        <div class="demo-narration-text"></div>
        <div class="demo-narration-progress">
          <div class="demo-progress-bar"></div>
        </div>
        <div class="demo-controls">
          <button class="demo-btn demo-skip">Skip Demo</button>
          <button class="demo-btn demo-next">Next</button>
        </div>
      </div>
    `;
    document.body.appendChild(panel);
    DEMO.narrationPanel = panel;
    
    // Wire controls
    panel.querySelector('.demo-skip').addEventListener('click', () => DEMO.skip());
    panel.querySelector('.demo-next').addEventListener('click', () => DEMO.next());
  },
  
  narrate(text) {
    const textEl = DEMO.narrationPanel.querySelector('.demo-narration-text');
    textEl.textContent = text;
  },
  
  // ─── HIGHLIGHT SYSTEM ──────────────────────────────
  highlight(selector, options = {}) {
    const el = document.querySelector(selector);
    if (!el) return;
    
    el.classList.add('demo-highlight');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-remove after delay (unless persistent)
    if (!options.persistent) {
      setTimeout(() => {
        el.classList.remove('demo-highlight');
      }, options.duration || 3000);
    }
  },
  
  unhighlight(selector) {
    const el = document.querySelector(selector);
    if (el) el.classList.remove('demo-highlight');
  },
  
  // ─── ANIMATION HELPERS ─────────────────────────────
  fadeIn(selector, delay = 0) {
    const el = document.querySelector(selector);
    if (!el) return;
    
    el.style.animation = `demo-fade-in 0.6s ease-out ${delay}ms forwards`;
  },
  
  slideUp(selector, delay = 0) {
    const el = document.querySelector(selector);
    if (!el) return;
    
    el.style.animation = `demo-slide-up 0.6s ease-out ${delay}ms forwards`;
  },
  
  countUp(selectorOrElement, target, duration = 1500) {
    const el = typeof selectorOrElement === 'string' 
      ? document.querySelector(selectorOrElement)
      : selectorOrElement;
    if (!el) return;
    
    const current = parseInt(el.textContent) || 0;
    const increment = (target - current) / (duration / 50);
    let value = current;
    
    const timer = setInterval(() => {
      value += increment;
      if (value >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(value);
      }
    }, 50);
  },
  
  pulse(selector, count = 3) {
    const el = document.querySelector(selector);
    if (!el) return;
    
    el.style.animation = `demo-pulse ${count * 1.2}s ease-in-out`;
  },
  
  // ─── FLOW CONTROL ──────────────────────────────────
  next() {
    const flow = DEMO.sceneDemos[DEMO.currentScene];
    if (!flow) return;
    
    if (DEMO.step < DEMO.maxSteps) {
      const stepFn = flow.steps[DEMO.step];
      if (stepFn && typeof stepFn === 'function') {
        stepFn();
      }
      
      DEMO.step++;
      DEMO.updateProgressBar();
      
      if (DEMO.auto && DEMO.step < DEMO.maxSteps) {
        DEMO.scheduleNext();
      }
    }
  },
  
  scheduleNext() {
    setTimeout(() => DEMO.next(), DEMO.autoPlayDelay);
  },
  
  skip() {
    DEMO.auto = false;
    DEMO.narrationPanel?.remove();
    DEMO.clearAllHighlights();
    DEMO.step = DEMO.maxSteps;
  },
  
  updateProgressBar() {
    const progress = (DEMO.step / DEMO.maxSteps) * 100;
    const bar = DEMO.narrationPanel.querySelector('.demo-progress-bar');
    if (bar) bar.style.width = progress + '%';
  },
  
  clearAllHighlights() {
    document.querySelectorAll('.demo-highlight').forEach(el => {
      el.classList.remove('demo-highlight');
    });
  },
  
  // ─── UTILITIES ─────────────────────────────────────
  pause() {
    DEMO.auto = false;
  },
  
  resume() {
    DEMO.auto = true;
    DEMO.scheduleNext();
  },
  
  // ─── CURSOR INTEGRATION ────────────────────────────
  moveCursorToElement(selector, duration = 1000, callback) {
    const el = typeof selector === 'string' 
      ? document.querySelector(selector)
      : selector;
    if (!el) {
      if (callback) callback();
      return;
    }
    
    const rect = el.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;
    
    const currentPos = DEMO_CURSOR.getPosition();
    const path = [
      currentPos,
      {
        x: currentPos.x + (targetX - currentPos.x) * 0.25,
        y: currentPos.y + (targetY - currentPos.y) * 0.25
      },
      {
        x: currentPos.x + (targetX - currentPos.x) * 0.75,
        y: currentPos.y + (targetY - currentPos.y) * 0.75
      },
      { x: targetX, y: targetY }
    ];
    
    DEMO_CURSOR.moveCursor(path, duration, callback);
  },
  
  clickCursor() {
    const pos = DEMO_CURSOR.getPosition();
    DEMO_CURSOR.click(pos.x, pos.y);
  },
  
  hoverCursorOn(selector, duration = 800) {
    DEMO_CURSOR.hover(selector, duration);
  },
  
  showCursor() {
    DEMO_CURSOR.show();
  },
  
  hideCursor() {
    DEMO_CURSOR.hide();
  }
};

