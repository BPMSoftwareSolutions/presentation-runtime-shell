/**
 * Demo Cursor System
 * 
 * Visualizes a user operating the interface with:
 * - Animated cursor dot following a smooth path
 * - Click ripples emanating from cursor position
 * - Hover states on interactive elements
 * - Synchronized with DEMO narration timing
 */

const DEMO_CURSOR = (() => {
  let cursorElement = null;
  let isInitialized = false;
  let currentPath = [];
  let pathIndex = 0;
  let isAnimating = false;
  let animationTimeoutId = null;

  /**
   * Cubic bezier easing for smooth cursor movement
   */
  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  /**
   * Calculate a point along a cubic bezier curve
   * p0: start point, p1: control point 1, p2: control point 2, p3: end point
   */
  const cubicBezier = (p0, p1, p2, p3, t) => {
    const mt = 1 - t;
    return (
      Math.pow(mt, 3) * p0 +
      3 * Math.pow(mt, 2) * t * p1 +
      3 * mt * Math.pow(t, 2) * p2 +
      Math.pow(t, 3) * p3
    );
  };

  /**
   * Initialize cursor visual layer
   */
  const init = () => {
    if (isInitialized) return;

    // Create cursor dot
    cursorElement = document.createElement('div');
    cursorElement.id = 'demo-cursor-dot';
    cursorElement.style.cssText = `
      position: fixed;
      width: 8px;
      height: 8px;
      background: #00D9FF;
      border-radius: 50%;
      box-shadow: 0 0 12px #00D9FF33, 0 0 24px #00D9FF66;
      pointer-events: none;
      z-index: 10001;
      left: -10px;
      top: -10px;
      opacity: 0;
      transition: opacity 0.3s ease-out;
    `;
    document.body.appendChild(cursorElement);

    // Create click ripple container
    const rippleContainer = document.createElement('div');
    rippleContainer.id = 'demo-cursor-ripples';
    rippleContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10000;
    `;
    document.body.appendChild(rippleContainer);

    isInitialized = true;
  };

  /**
   * Move cursor along a smooth path
   * path: array of {x, y} points
   * duration: milliseconds for entire path
   * callback: function called when path complete
   */
  const moveCursor = (path, duration, callback) => {
    if (!isInitialized) init();
    if (path.length === 0) {
      if (callback) callback();
      return;
    }

    cancelAnimationFrame(animationTimeoutId);
    isAnimating = true;
    currentPath = path;
    pathIndex = 0;

    // Show cursor
    cursorElement.style.opacity = '1';

    const startTime = performance.now();
    const segmentDuration = duration / (path.length - 1);

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Calculate current segment
      const segment = Math.min(progress * (path.length - 1), path.length - 2);
      const segmentStart = Math.floor(segment);
      const segmentEnd = Math.ceil(segment);
      const segmentProgress = segment - segmentStart;

      if (segmentStart < path.length - 1) {
        const p0 = path[Math.max(0, segmentStart - 1)];
        const p1 = path[segmentStart];
        const p2 = path[segmentEnd];
        const p3 = path[Math.min(path.length - 1, segmentEnd + 1)];

        const eased = easeInOutCubic(segmentProgress);

        const x = cubicBezier(p0.x, p1.x, p2.x, p3.x, eased);
        const y = cubicBezier(p0.y, p1.y, p2.y, p3.y, eased);

        cursorElement.style.left = (x - 4) + 'px';
        cursorElement.style.top = (y - 4) + 'px';
      }

      if (progress < 1) {
        animationTimeoutId = requestAnimationFrame(animate);
      } else {
        isAnimating = false;
        if (callback) callback();
      }
    };

    animationTimeoutId = requestAnimationFrame(animate);
  };

  /**
   * Click at current cursor position with ripple effect
   */
  const click = (x, y) => {
    if (!isInitialized) init();

    // Move cursor to click position
    cursorElement.style.left = (x - 4) + 'px';
    cursorElement.style.top = (y - 4) + 'px';

    // Create ripple
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      box-shadow: 0 0 0 2px #00D9FF;
      pointer-events: none;
      transform: translate(-50%, -50%);
      animation: demo-click-ripple 0.6s ease-out forwards;
    `;
    document.getElementById('demo-cursor-ripples').appendChild(ripple);

    // Clean up ripple after animation
    setTimeout(() => ripple.remove(), 600);
  };

  /**
   * Hover effect on element
   */
  const hover = (selector, duration = 800) => {
    const element = typeof selector === 'string' 
      ? document.querySelector(selector)
      : selector;

    if (!element) return;

    element.classList.add('demo-hover-highlight');
    element.style.boxShadow = (element.style.boxShadow || '') + ', 0 0 20px #00D9FF66';

    setTimeout(() => {
      element.classList.remove('demo-hover-highlight');
      element.style.boxShadow = element.style.boxShadow.replace(', 0 0 20px #00D9FF66', '');
    }, duration);
  };

  /**
   * Hide cursor
   */
  const hide = () => {
    if (cursorElement) {
      cursorElement.style.opacity = '0';
    }
  };

  /**
   * Show cursor
   */
  const show = () => {
    if (!isInitialized) init();
    if (cursorElement) {
      cursorElement.style.opacity = '1';
    }
  };

  /**
   * Get current cursor position
   */
  const getPosition = () => {
    if (!cursorElement) return { x: 0, y: 0 };
    const rect = cursorElement.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };

  return {
    init,
    moveCursor,
    click,
    hover,
    hide,
    show,
    getPosition,
    isAnimating: () => isAnimating
  };
})();

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes demo-click-ripple {
    0% {
      width: 0;
      height: 0;
      opacity: 0.8;
    }
    100% {
      width: 60px;
      height: 60px;
      opacity: 0;
    }
  }

  .demo-hover-highlight {
    transition: all 0.3s ease-out !important;
  }
`;
document.head.appendChild(style);
