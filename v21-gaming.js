/* V21.7 — hard-wired cinematic viewer + cursor VFX trail */
(() => {
  const root = document.getElementById('nhGamingHistory');
  if (!root) return;

  let viewer = root.querySelector('#nhGameViewer');
  let selectedUrl = '';
  let trail = [];

  function ensureViewer() {
    if (viewer) return viewer;

    viewer = document.createElement('div');
    viewer.id = 'nhGameViewer';
    viewer.className = 'nh-game-viewer';
    viewer.setAttribute('aria-hidden', 'true');
    viewer.innerHTML = `
      <div class="nh-game-viewer-panel" role="dialog" aria-modal="true" aria-label="Gaming archive viewer">
        <button class="nh-game-viewer-close" type="button" aria-label="Close gaming viewer">×</button>
        <div class="nh-viewer-art">
          <img id="nhViewerImg" alt="">
          <span class="nh-viewer-scan"></span>
          <span class="nh-viewer-label">ARCHIVE // VISUAL</span>
        </div>
        <div class="nh-viewer-content">
          <div class="nh-viewer-kicker" id="nhViewerKicker">GAME ARCHIVE // CINEMATIC VIEWER</div>
          <h3 id="nhViewerTitle">GAME</h3>
          <div class="nh-viewer-subtitle" id="nhViewerSubtitle"></div>
          <div class="nh-viewer-price-row">
            <span><small>EDITION</small><strong id="nhViewerEdition"></strong></span>
            <span><small>PRICE</small><strong id="nhViewerPrice"></strong></span>
          </div>
          <div class="nh-viewer-details" id="nhViewerDetails"></div>
          <section class="nh-viewer-section">
            <span>DETAIL // ARCHIVE NOTE</span>
            <p id="nhViewerDesc"></p>
          </section>
          <section class="nh-viewer-section">
            <span>WHY PLAY // MY TAKE</span>
            <p id="nhViewerWhy"></p>
          </section>
          <div class="nh-viewer-source" id="nhViewerSource"></div>
          <div class="nh-viewer-actions">
            <button class="nh-viewer-copy" type="button">COPY LINK</button>
            <a class="nh-viewer-open" id="nhViewerOpen" href="#" target="_blank" rel="noopener noreferrer">OPEN GAME PAGE ↗</a>
          </div>
        </div>
      </div>`;
    root.appendChild(viewer);
    return viewer;
  }

  function decodeDetails(card) {
    try { return JSON.parse(card.dataset.details || '[]'); }
    catch { return []; }
  }

  function openViewer(card) {
    if (!card) return;
    const v = ensureViewer();
    const panel = v.querySelector('.nh-game-viewer-panel');
    const img = v.querySelector('#nhViewerImg');
    const kicker = v.querySelector('#nhViewerKicker');
    const title = v.querySelector('#nhViewerTitle');
    const subtitle = v.querySelector('#nhViewerSubtitle');
    const edition = v.querySelector('#nhViewerEdition');
    const price = v.querySelector('#nhViewerPrice');
    const details = v.querySelector('#nhViewerDetails');
    const desc = v.querySelector('#nhViewerDesc');
    const why = v.querySelector('#nhViewerWhy');
    const source = v.querySelector('#nhViewerSource');
    const openLink = v.querySelector('#nhViewerOpen');

    selectedUrl = card.dataset.url || '';
    const isGacha = card.dataset.kind === 'gacha';

    if (img) { img.src = card.dataset.img || ''; img.alt = (card.dataset.game || 'GAME') + ' artwork'; }
    if (kicker) kicker.textContent = isGacha ? 'GACHA ARCHIVE // CINEMATIC VIEWER' : 'GAME ARCHIVE // CINEMATIC VIEWER';
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

    v.classList.add('open');
    v.setAttribute('aria-hidden', 'false');
    root.classList.add('viewer-active');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => panel?.classList.add('ready'));
  }

  function closeViewer() {
    if (!viewer) return;
    const panel = viewer.querySelector('.nh-game-viewer-panel');
    panel?.classList.remove('ready');
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden', 'true');
    root.classList.remove('viewer-active');
    document.body.style.overflow = '';
  }

  function bindCard(card) {
    if (card.dataset.nhBound === '1') return;
    card.dataset.nhBound = '1';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');

    // Direct handlers are intentional: they bypass any portfolio-wide bubbling/capture
    // layer that may interfere with normal card clicks.
    card.onpointerup = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      openViewer(card);
    };

    card.onkeydown = (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      e.stopPropagation();
      openViewer(card);
    };

    card.onpointermove = (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
      const y = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
      card.style.setProperty('--mx', x.toFixed(1) + '%');
      card.style.setProperty('--my', y.toFixed(1) + '%');
      card.style.setProperty('--rx', ((50 - y) / 20).toFixed(2) + 'deg');
      card.style.setProperty('--ry', ((x - 50) / 24).toFixed(2) + 'deg');
      card.style.setProperty('--hovered', '1');
    };

    card.onpointerleave = () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--hovered', '0');
    };
  }

  root.querySelectorAll('.nh-game-card,.nh-gacha-card').forEach(bindCard);

  if (viewer) {
    viewer.querySelector('.nh-game-viewer-close')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeViewer();
    });
    viewer.addEventListener('click', (e) => { if (e.target === viewer) closeViewer(); });
    viewer.querySelector('.nh-viewer-open')?.addEventListener('click', e => e.stopPropagation());
  }

  root.querySelector('.nh-viewer-copy')?.addEventListener('click', async () => {
    if (!selectedUrl) return;
    const button = root.querySelector('.nh-viewer-copy');
    try {
      await navigator.clipboard.writeText(selectedUrl);
      button.textContent = 'COPIED ✓';
    } catch {
      const area = document.createElement('textarea');
      area.value = selectedUrl;
      area.style.position = 'fixed';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      try { document.execCommand('copy'); button.textContent = 'COPIED ✓'; }
      catch { button.textContent = 'COPY BLOCKED'; }
      area.remove();
    }
    setTimeout(() => { button.textContent = 'COPY LINK'; }, 1200);
  });

  root.querySelectorAll('.nh-gaming-filter').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      root.querySelectorAll('.nh-gaming-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter || 'all';
      root.querySelectorAll('.nh-game-card,.nh-gacha-card').forEach(card => {
        const tags = (card.dataset.tags || 'all').split(/\s+/);
        card.hidden = f !== 'all' && !tags.includes(f);
      });
    });
  });

  root.querySelector('.nh-gaming-pulse')?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    root.classList.toggle('pulse-active');
  });

  // Three coordinated VFX layers: moving cursor core, living trail, and ambient particles.
  const trailField = document.createElement('div');
  trailField.className = 'nh-gaming-trail';
  for (let i = 0; i < 9; i++) {
    const dot = document.createElement('i');
    dot.style.setProperty('--trail-index', i);
    trailField.appendChild(dot);
  }
  root.appendChild(trailField);
  trail = [...trailField.children];

  root.addEventListener('pointermove', (e) => {
    const r = root.getBoundingClientRect();
    const x = ((e.clientX - r.left) / Math.max(1, r.width)) * 100;
    const y = ((e.clientY - r.top) / Math.max(1, r.height)) * 100;
    root.style.setProperty('--gx', x.toFixed(2) + '%');
    root.style.setProperty('--gy', y.toFixed(2) + '%');
    root.style.setProperty('--cursor-visible', '1');

    trail.forEach((dot, index) => {
      dot.style.left = x + '%';
      dot.style.top = y + '%';
      dot.style.setProperty('--trail-index', index);
    });
  }, { passive: true });

  root.addEventListener('pointerleave', () => {
    root.style.setProperty('--cursor-visible', '0');
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeViewer();
  });
})();