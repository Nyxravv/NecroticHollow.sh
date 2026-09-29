/* V21.0 — interactive gaming history archive */
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
    root.style.setProperty('--popover-x', '50%');
    root.style.setProperty('--popover-y', '50%');
  }

  cards.forEach(card => {
    const body = card.querySelector('.nh-game-body');
    const icon = card.querySelector('.nh-game-icon');
    const expand = card.querySelector('.nh-game-expand');

    body?.addEventListener('click', (e) => {
      if (e.target.closest('.nh-game-icon')) return;
      const open = card.classList.toggle('expanded');
      card.setAttribute('aria-expanded', String(open));
    });

    expand?.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = card.classList.toggle('expanded');
      card.setAttribute('aria-expanded', String(open));
    });

    icon?.addEventListener('click', (e) => {
      e.stopPropagation();
      openPopover(card);
    });

    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
      const y = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
      card.style.setProperty('--mx', x.toFixed(1) + '%');
      card.style.setProperty('--my', y.toFixed(1) + '%');
      card.style.setProperty('--rx', ((50 - y) / 30).toFixed(2) + 'deg');
      card.style.setProperty('--ry', ((x - 50) / 36).toFixed(2) + 'deg');
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  root.querySelector('.nh-gaming-expand-all')?.addEventListener('click', () => {
    cards.forEach(card => {
      card.classList.add('expanded');
      card.setAttribute('aria-expanded', 'true');
    });
  });

  root.querySelector('.nh-gaming-collapse-all')?.addEventListener('click', () => {
    cards.forEach(card => {
      card.classList.remove('expanded');
      card.setAttribute('aria-expanded', 'false');
    });
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
  });

  const pulse = root.querySelector('.nh-gaming-pulse');
  if (pulse) {
    pulse.addEventListener('pointerenter', () => root.classList.add('pulse-active'));
    pulse.addEventListener('pointerleave', () => root.classList.remove('pulse-active'));
  }
})();