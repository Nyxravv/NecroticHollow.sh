/* V21.6 — bulletproof card interaction + flagship reactive VFX */
(() => {
  const root = document.getElementById('nhGamingHistory');
  if (!root) return;

  const cards = [...root.querySelectorAll('.nh-game-card, .nh-gacha-card')];
  const viewer = document.getElementById('nhGameViewer');
  if (!viewer) return;

  const panel = viewer.querySelector('.nh-game-viewer-panel');
  const img = viewer.querySelector('#nhViewerImg');
  const kicker = viewer.querySelector('#nhViewerKicker');
  const title = viewer.querySelector('#nhViewerTitle');
  const subtitle = viewer.querySelector('#nhViewerSubtitle');
  const edition = viewer.querySelector('#nhViewerEdition');
  const price = viewer.querySelector('#nhViewerPrice');
  const details = viewer.querySelector('#nhViewerDetails');
  const desc = viewer.querySelector('#nhViewerDesc');
  const why = viewer.querySelector('#nhViewerWhy');
  const source = viewer.querySelector('#nhViewerSource');
  const openLink = viewer.querySelector('#nhViewerOpen');
  const copyBtn = viewer.querySelector('.nh-viewer-copy');
  const closeBtn = viewer.querySelector('.nh-game-viewer-close');

  let selectedUrl = '';

  function decodeDetails(card) {
    try {
      return JSON.parse(card.dataset.details || '[]');
    } catch {
      return [];
    }
  }

  function openViewer(card) {
    if (!card || !viewer) return;

    selectedUrl = card.dataset.url || '';
    const isGacha = card.dataset.kind === 'gacha';

    if (img) {
      img.src = card.dataset.img || '';
      img.alt = (card.dataset.game || 'GAME') + ' artwork';
    }

    if (kicker) kicker.textContent = isGacha
      ? 'GACHA ARCHIVE // CINEMATIC VIEWER'
      : 'GAME ARCHIVE // CINEMATIC VIEWER';

    if (title) title.textContent = card.dataset.game || 'GAME';
    if (subtitle) subtitle.textContent = card.dataset.subtitle || '';
    if (edition) edition.textContent = card.dataset.edition || 'BASE / CURRENT';
    if (price) price.textContent = card.dataset.price || 'CHECK STORE';
    if (desc) desc.textContent = card.dataset.desc || '';
    if (why) why.textContent = card.dataset.why || '';
    if (source) source.textContent = card.dataset.source || '';

    if (details) {
      details.replaceChildren();
      decodeDetails(card).forEach(([labelText, valueText]) => {
        const box = document.createElement('span');
        const small = document.createElement('small');
        const strong = document.createElement('strong');
        small.textContent = labelText;
        strong.textContent = valueText;
        box.append(small, strong);
        details.appendChild(box);
      });
    }

    if (openLink) openLink.href = selectedUrl || '#';

    viewer.classList.add('open');
    viewer.setAttribute('aria-hidden', 'false');
    root.classList.add('viewer-active');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => panel?.classList.add('ready'));
  }

  function closeViewer() {
    panel?.classList.remove('ready');
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden', 'true');
    root.classList.remove('viewer-active');
    document.body.style.overflow = '';
  }

  // Global capture handler: catches card clicks before other portfolio layers can swallow them.
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const card = target.closest('#nhGamingHistory .nh-game-card, #nhGamingHistory .nh-gacha-card');
    if (!card) return;

    event.preventDefault();
    event.stopPropagation();
    openViewer(card);
  }, true);

  // Also support keyboard activation.
  document.addEventListener('keydown', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const card = target.closest('#nhGamingHistory .nh-game-card, #nhGamingHistory .nh-gacha-card');
    if (!card) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openViewer(card);
    }
  }, true);

  cards.forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.addEventListener('pointermove', (event) => {
      const r = card.getBoundingClientRect();
      const x = ((event.clientX - r.left) / Math.max(1, r.width)) * 100;
      const y = ((event.clientY - r.top) / Math.max(1, r.height)) * 100;
      card.style.setProperty('--mx', x.toFixed(1) + '%');
      card.style.setProperty('--my', y.toFixed(1) + '%');
      card.style.setProperty('--rx', ((50 - y) / 20).toFixed(2) + 'deg');
      card.style.setProperty('--ry', ((x - 50) / 24).toFixed(2) + 'deg');
      card.style.setProperty('--hovered', '1');
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--hovered', '0');
    }, { passive: true });
  });

  root.querySelectorAll('.nh-gaming-filter').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      root.querySelectorAll('.nh-gaming-filter').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter || 'all';

      cards.forEach((card) => {
        const tags = (card.dataset.tags || 'all').split(/\s+/);
        card.hidden = filter !== 'all' && !tags.includes(filter);
      });
    });
  });

  root.querySelector('.nh-gaming-pulse')?.addEventListener('click', (event) => {
    event.stopPropagation();
    root.classList.toggle('pulse-active');
  });

  root.addEventListener('pointermove', (event) => {
    const r = root.getBoundingClientRect();
    const x = ((event.clientX - r.left) / Math.max(1, r.width)) * 100;
    const y = ((event.clientY - r.top) / Math.max(1, r.height)) * 100;
    root.style.setProperty('--gx', x.toFixed(1) + '%');
    root.style.setProperty('--gy', y.toFixed(1) + '%');
  }, { passive: true });

  closeBtn?.addEventListener('click', (event) => {
    event.stopPropagation();
    closeViewer();
  });

  viewer.addEventListener('click', (event) => {
    if (event.target === viewer) closeViewer();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && viewer.classList.contains('open')) closeViewer();
  });

  copyBtn?.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!selectedUrl) return;

    try {
      await navigator.clipboard.writeText(selectedUrl);
      copyBtn.textContent = 'COPIED ✓';
    } catch {
      const area = document.createElement('textarea');
      area.value = selectedUrl;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand('copy');
        copyBtn.textContent = 'COPIED ✓';
      } catch {
        copyBtn.textContent = 'COPY BLOCKED';
      }
      area.remove();
    }
    window.setTimeout(() => { copyBtn.textContent = 'COPY LINK'; }, 1200);
  });

  openLink?.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  window.NHOpenGamingViewer = openViewer;
})();