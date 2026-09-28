(() => {
  'use strict';

  // V20.0 — universal interaction layer.
  // Adds sharp click feedback + stronger hover response without replacing
  // the portfolio's existing hover/click behaviour.

  const INTERACTIVE = [
    'a', 'button', '[role="button"]', '[onclick]',
    'input', 'select', 'textarea', 'summary',
    '.clickable', '.tier-item', '.tier-card', '.tier-button',
    '.project-card', '.media-card', '.viewer-trigger',
    '.profile-card', '.info-card', '.card', '.nav-item',
    '.project', '.work-card', '.image-card'
  ].join(',');

  const style = document.createElement('style');
  style.id = 'nh-v20-interactions';
  style.textContent = `
    :root {
      --nh-red: #ff164f;
      --nh-pink: #ff4f91;
      --nh-purple: #a83dff;
      --nh-violet: #d36bff;
      --nh-glow: 0 0 0.8rem rgba(168,61,255,.38), 0 0 2rem rgba(255,22,79,.18);
    }

    /* Keep the existing design intact, but make interactive surfaces feel alive. */
    a, button, [role="button"], [onclick], summary,
    .clickable, .tier-item, .tier-card, .tier-button,
    .project-card, .media-card, .viewer-trigger, .profile-card,
    .info-card, .card, .nav-item, .project, .work-card, .image-card {
      -webkit-tap-highlight-color: transparent;
      transition:
        transform .16s cubic-bezier(.2,.8,.2,1),
        filter .16s ease,
        box-shadow .2s ease,
        border-color .2s ease,
        text-shadow .2s ease;
    }

    a:hover, button:hover, [role="button"]:hover, [onclick]:hover, summary:hover,
    .clickable:hover, .tier-item:hover, .tier-card:hover, .tier-button:hover,
    .project-card:hover, .media-card:hover, .viewer-trigger:hover, .profile-card:hover,
    .info-card:hover, .card:hover, .nav-item:hover, .project:hover,
    .work-card:hover, .image-card:hover {
      filter: brightness(1.16) saturate(1.16);
      box-shadow: var(--nh-glow);
      text-shadow: 0 0 1rem rgba(255,79,145,.28);
    }

    .nh-v20-clicking {
      transform: translateY(1px) scale(.975) !important;
      filter: brightness(1.35) saturate(1.3) !important;
      box-shadow:
        0 0 0 1px rgba(255,79,145,.9),
        0 0 1rem rgba(255,22,79,.7),
        0 0 2.6rem rgba(168,61,255,.65) !important;
    }

    .nh-v20-clicked {
      animation: nhV20ClickPulse .42s cubic-bezier(.2,.8,.2,1);
    }

    @keyframes nhV20ClickPulse {
      0%   { filter: brightness(1.5) saturate(1.35); }
      35%  { filter: brightness(2) saturate(1.5); text-shadow: 0 0 1.4rem rgba(255,79,145,.65); }
      100% { filter: brightness(1) saturate(1); }
    }

    .nh-v20-flash {
      position: fixed;
      z-index: 2147483647;
      width: 18px;
      height: 18px;
      margin: -9px 0 0 -9px;
      border-radius: 50%;
      pointer-events: none;
      border: 1px solid rgba(255,255,255,.95);
      background: radial-gradient(circle, rgba(255,255,255,.95) 0 8%, rgba(255,79,145,.85) 25%, rgba(168,61,255,.35) 55%, transparent 72%);
      box-shadow:
        0 0 10px rgba(255,255,255,.9),
        0 0 28px rgba(255,22,79,.75),
        0 0 55px rgba(168,61,255,.7);
      animation: nhV20Flash .48s cubic-bezier(.1,.7,.2,1) forwards;
    }

    @keyframes nhV20Flash {
      0%   { opacity: 1; transform: scale(.35); }
      55%  { opacity: .95; transform: scale(3.4); }
      100% { opacity: 0; transform: scale(7); }
    }

    .nh-v20-scan {
      position: fixed;
      z-index: 2147483646;
      left: 0;
      right: 0;
      height: 1px;
      pointer-events: none;
      background: linear-gradient(90deg, transparent, rgba(255,22,79,.85), rgba(168,61,255,.9), transparent);
      box-shadow: 0 0 12px rgba(168,61,255,.8), 0 0 24px rgba(255,22,79,.5);
      animation: nhV20Scan .34s ease-out forwards;
    }

    @keyframes nhV20Scan {
      from { top: var(--nh-click-y); opacity: .95; transform: scaleX(.35); }
      to   { top: var(--nh-click-y); opacity: 0; transform: scaleX(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      a, button, [role="button"], [onclick], summary,
      .clickable, .tier-item, .tier-card, .tier-button,
      .project-card, .media-card, .viewer-trigger, .profile-card,
      .info-card, .card, .nav-item, .project, .work-card, .image-card {
        transition: filter .12s ease, box-shadow .12s ease;
      }
      .nh-v20-clicked, .nh-v20-flash, .nh-v20-scan { animation: none !important; }
    }
  `;
  document.head.appendChild(style);

  function isInteractive(el) {
    return el && el.matches && el.matches(INTERACTIVE);
  }

  function makeFlash(x, y) {
    const flash = document.createElement('span');
    flash.className = 'nh-v20-flash';
    flash.style.left = `${x}px`;
    flash.style.top = `${y}px`;
    document.body.appendChild(flash);
    flash.addEventListener('animationend', () => flash.remove(), { once: true });

    const scan = document.createElement('span');
    scan.className = 'nh-v20-scan';
    scan.style.setProperty('--nh-click-y', `${y}px`);
    document.body.appendChild(scan);
    scan.addEventListener('animationend', () => scan.remove(), { once: true });
  }

  document.addEventListener('pointerdown', (event) => {
    const target = event.target.closest?.(INTERACTIVE);
    if (!isInteractive(target)) return;

    target.classList.add('nh-v20-clicking');
    makeFlash(event.clientX, event.clientY);

    const release = () => {
      target.classList.remove('nh-v20-clicking');
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    };
    window.addEventListener('pointerup', release, { once: true });
    window.addEventListener('pointercancel', release, { once: true });
  }, { passive: true });

  document.addEventListener('click', (event) => {
    const target = event.target.closest?.(INTERACTIVE);
    if (!isInteractive(target)) return;
    target.classList.remove('nh-v20-clicked');
    // Force a fresh animation when the same element is clicked repeatedly.
    void target.offsetWidth;
    target.classList.add('nh-v20-clicked');
    target.addEventListener('animationend', () => target.classList.remove('nh-v20-clicked'), { once: true });
  }, true);

  // Keyboard activation gets the same visual response for accessibility.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const target = document.activeElement;
    if (!isInteractive(target)) return;
    const rect = target.getBoundingClientRect();
    makeFlash(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
})();
