/* V21.1 — tighter cards, reliable expand controls, stronger mouse VFX */
(() => {
  const root = document.getElementById('nhGamingHistory');
  if (!root) return;

  const cards = [...root.querySelectorAll('.nh-game-card')];
  const popover = root.querySelector('.nh-game-link-popover');
  const popoverTitle = root.querySelector('.nh-game-link-title');
  const popoverUrl = root.querySelector('.nh-game-link-url');
  const copyBtn = root.querySelector('.nh-game-copy');
  const openBtn = root.querySelector('.nh-game-open');
  const closeBtn = root.querySelector('.nh-game-link-close');
  let selectedUrl = '';

  const setExpanded = (card, open) => {
    const details = card.querySelector('.nh-game-details');
    const button = card.querySelector('.nh-game-expand');
    card.classList.toggle('expanded', open);
    card.setAttribute('aria-expanded', String(open));
    if (details) {
      details.style.maxHeight = open ? details.scrollHeight + 'px' : '0px';
      details.style.opacity = open ? '1' : '0';
      details.style.paddingTop = open ? '12px' : '0';
      details.style.paddingBottom = open ? '14px' : '0';
    }
    if (button) button.innerHTML = open ? 'COLLAPSE DETAIL' : 'EXPAND DETAIL';
  };

  function closePopover() {
    popover.classList.remove('open');
    popover.setAttribute('aria-hidden', 'true');
  }

  function openPopover(card) {
    selectedUrl = card.dataset.url || '';
    popoverTitle.textContent = card.dataset.game || 'GAME';
    popoverUrl.textContent = selectedUrl.replace(/^https?:\/\//,'');
    popover.classList.add('open');
    popover.setAttribute('aria-hidden', 'false');
  }

  function toggleCard(card, force) {
    if (!card) return;
    const open = typeof force === 'boolean' ? force : !card.classList.contains('expanded');
    card.classList.toggle('expanded', open);
    card.setAttribute('aria-expanded', String(open));
    const details = card.querySelector('.nh-game-details');
    const button = card.querySelector('.nh-game-expand');
    if (details) {
      if (open) {
        details.hidden = false;
        details.hidden = false;
      details.style.maxHeight = details.scrollHeight + 'px';
        details.style.opacity = '1';
      } else {
        details.style.maxHeight = '0px';
        details.style.opacity = '0';
        window.setTimeout(() => {
          if (!card.classList.contains('expanded')) details.hidden = true;
        }, 430);
      }
    }
    if (button) {
      button.textContent = open ? 'COLLAPSE DETAIL' : 'EXPAND DETAIL';
      button.setAttribute('aria-expanded', String(open));
    }
  }

  cards.forEach(card => {
    const body = card.querySelector('.nh-game-body');
    const icon = card.querySelector('.nh-game-icon');

    const details = card.querySelector('.nh-game-details');
    if (details) details.hidden = true;
    toggleCard(card, false);

    body?.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      toggleCard(card);
    });

    icon?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openPopover(card);
    });

    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
      const y = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
      card.style.setProperty('--mx', x.toFixed(1) + '%');
      card.style.setProperty('--my', y.toFixed(1) + '%');
      card.style.setProperty('--rx', ((50 - y) / 24).toFixed(2) + 'deg');
      card.style.setProperty('--ry', ((x - 50) / 30).toFixed(2) + 'deg');
      card.style.setProperty('--glow', '1');
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--glow', '0');
    });
  });

  // Capture clicks at document level so the expand control still works even if
  // another portfolio layer intercepts bubbling events.
  document.addEventListener('click', (e) => {
    const button = e.target.closest('#nhGamingHistory .nh-game-expand');
    if (!button) return;
    e.preventDefault();
    e.stopPropagation();
    const card = button.closest('.nh-game-card');
    toggleCard(card);
  }, true);

  root.querySelector('.nh-gaming-expand-all')?.addEventListener('click', () => {
    cards.forEach(card => setExpanded(card, true));
  });

  root.querySelector('.nh-gaming-collapse-all')?.addEventListener('click', () => {
    cards.forEach(card => setExpanded(card, false));
  });

  root.querySelectorAll('.nh-gaming-filter').forEach(button => {
    button.addEventListener('click', () => {
      root.querySelectorAll('.nh-gaming-filter').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.filter;
      cards.forEach(card => {
        const tags = (card.dataset.tags || '').split(/\s+/);
        card.hidden = filter !== 'all' && !tags.includes(filter);
      });
    });
  });

  copyBtn?.addEventListener('click', async () => {
    if (!selectedUrl) return;
    try {
      await navigator.clipboard.writeText(selectedUrl);
      copyBtn.textContent = 'COPIED ✓';
      setTimeout(() => { copyBtn.textContent = 'COPY LINK'; }, 1200);
    } catch {
      copyBtn.textContent = 'COPY BLOCKED';
      setTimeout(() => { copyBtn.textContent = 'COPY LINK'; }, 1200);
    }
  });

  openBtn?.addEventListener('click', () => {
    if (!selectedUrl) return;
    window.open(selectedUrl, '_blank', 'noopener,noreferrer');
    closePopover();
  });

  closeBtn?.addEventListener('click', closePopover);
  popover?.addEventListener('click', (e) => {
    if (e.target === popover) closePopover();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopover();
  });

  root.addEventListener('pointermove', (e) => {
    const r = root.getBoundingClientRect();
    const x = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
    const y = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
    root.style.setProperty('--gx', x.toFixed(1) + '%');
    root.style.setProperty('--gy', y.toFixed(1) + '%');
    root.style.setProperty('--gangle', ((x + y) * 0.9).toFixed(1) + 'deg');
  });

  const pulse = root.querySelector('.nh-gaming-pulse');
  if (pulse) {
    pulse.addEventListener('pointerenter', () => root.classList.add('pulse-active'));
    pulse.addEventListener('pointerleave', () => root.classList.remove('pulse-active'));
  }

  window.addEventListener('resize', () => {
    cards.filter(c => c.classList.contains('expanded')).forEach(c => {
      const details = c.querySelector('.nh-game-details');
      if (details) details.style.maxHeight = details.scrollHeight + 'px';
    });
  }, {passive:true});
})();