/* V21.8 — coordinate-safe click routing + flagship mouse interaction */
(() => {
  const root = document.getElementById('nhGamingHistory');
  if (!root) return;

  let viewer = root.querySelector('#nhGameViewer');
  let selectedUrl = '';

  function ensureViewer() {
    if (viewer && viewer.querySelector('#nhViewerTitle')) return viewer;
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
          <section class="nh-viewer-section"><span>DETAIL // ARCHIVE NOTE</span><p id="nhViewerDesc"></p></section>
          <section class="nh-viewer-section"><span>WHY PLAY // MY TAKE</span><p id="nhViewerWhy"></p></section>
          <div class="nh-viewer-source" id="nhViewerSource"></div>
          <div class="nh-viewer-actions">
            <button class="nh-viewer-copy" type="button">COPY LINK</button>
            <a class="nh-viewer-open" id="nhViewerOpen" href="#" target="_blank" rel="noopener noreferrer">OPEN GAME PAGE ↗</a>
          </div>
        </div>
      </div>`;
    document.body.appendChild(viewer);
    bindViewerControls();
    return viewer;
  }

  function detailsFor(card) {
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

    img.src = card.dataset.img || '';
    img.alt = (card.dataset.game || 'GAME') + ' artwork';
    kicker.textContent = isGacha ? 'GACHA ARCHIVE // CINEMATIC VIEWER' : 'GAME ARCHIVE // CINEMATIC VIEWER';
    title.textContent = card.dataset.game || 'GAME';
    subtitle.textContent = card.dataset.subtitle || '';
    edition.textContent = card.dataset.edition || 'BASE / CURRENT';
    price.textContent = card.dataset.price || 'CHECK STORE';
    desc.textContent = card.dataset.desc || '';
    why.textContent = card.dataset.why || '';
    source.textContent = card.dataset.source || '';
    details.replaceChildren();

    detailsFor(card).forEach(([a,b]) => {
      const box = document.createElement('span');
      const small = document.createElement('small');
      const strong = document.createElement('strong');
      small.textContent = a;
      strong.textContent = b;
      box.append(small,strong);
      details.appendChild(box);
    });

    openLink.href = selectedUrl || '#';
    v.classList.add('open');
    v.setAttribute('aria-hidden','false');
    root.classList.add('viewer-active');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => panel?.classList.add('ready'));
  }

  function closeViewer() {
    if (!viewer) return;
    viewer.querySelector('.nh-game-viewer-panel')?.classList.remove('ready');
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden','true');
    root.classList.remove('viewer-active');
    document.body.style.overflow = '';
  }

  function bindCard(card) {
    if (card.dataset.nhBound === '1') return;
    card.dataset.nhBound = '1';
    card.tabIndex = 0;
    card.setAttribute('role','button');
  }

  root.querySelectorAll('.nh-game-card,.nh-gacha-card').forEach(bindCard);

  // Window-level fallback: the portfolio has full-page visual layers that can
  // become the actual hit-test target. We route pointer input by coordinates.
  function cardAtPoint(clientX, clientY) {
    for (const card of root.querySelectorAll('.nh-game-card,.nh-gacha-card')) {
      if (card.hidden) continue;
      const r = card.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) return card;
    }
    return null;
  }

  const routeGamePointer = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    if (viewer?.classList.contains('open')) return;
    const card = cardAtPoint(event.clientX, event.clientY);
    if (!card) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('#nhGamingHistory .nh-gaming-filter,#nhGamingHistory .nh-gaming-action')) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation?.();
    openViewer(card);
  };

  window.addEventListener('pointerdown', routeGamePointer, {capture:true, passive:false});
  window.addEventListener('mousedown', routeGamePointer, {capture:true, passive:false});

  // Normal click path.
  root.addEventListener('click', e => {
    const target = e.target instanceof Element ? e.target : null;
    const card = target?.closest('.nh-game-card,.nh-gacha-card');
    if (!card || target.closest('.nh-game-viewer')) return;
    if (target.closest('.nh-gaming-filter,.nh-gaming-action,.nh-game-viewer')) return;
    e.preventDefault();
    e.stopPropagation();
    openViewer(card);
  }, true);

  // Coordinate fallback: catches clicks even when a portfolio-wide visual overlay
  // becomes the event target and sits above the gaming cards in hit-testing.
  document.addEventListener('pointerup', e => {
    if (e.button !== 0) return;
    if (viewer?.classList.contains('open')) return;

    const x = e.clientX;
    const y = e.clientY;
    let hit = null;
    for (const card of root.querySelectorAll('.nh-game-card,.nh-gacha-card')) {
      if (card.hidden) continue;
      const r = card.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        hit = card;
        break;
      }
    }
    if (!hit) return;

    const target = e.target instanceof Element ? e.target : null;
    if (target?.closest('#nhGamingHistory .nh-gaming-filter,#nhGamingHistory .nh-gaming-action')) return;

    e.preventDefault();
    e.stopPropagation();
    openViewer(hit);
  }, true);

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (viewer?.classList.contains('open')) closeViewer();
  });

  function bindViewerControls() {
    if (!viewer) return;
    const close = viewer.querySelector('.nh-game-viewer-close');
    const backdrop = viewer;
    const copy = viewer.querySelector('.nh-viewer-copy');
    const open = viewer.querySelector('.nh-viewer-open');

    close?.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); closeViewer(); });
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closeViewer(); });
    open?.addEventListener('click', e => e.stopPropagation());
    copy?.addEventListener('click', async e => {
      e.preventDefault(); e.stopPropagation();
      if (!selectedUrl) return;
      try {
        await navigator.clipboard.writeText(selectedUrl);
        copy.textContent = 'COPIED ✓';
      } catch {
        const area = document.createElement('textarea');
        area.value = selectedUrl;
        area.style.position = 'fixed';
        area.style.left = '-9999px';
        document.body.appendChild(area);
        area.select();
        try { document.execCommand('copy'); copy.textContent = 'COPIED ✓'; }
        catch { copy.textContent = 'COPY BLOCKED'; }
        area.remove();
      }
      setTimeout(() => { copy.textContent='COPY LINK'; }, 1200);
    });
  }

  if (viewer) {
    if (viewer.parentNode !== document.body) document.body.appendChild(viewer);
    bindViewerControls();
  }

  root.querySelectorAll('.nh-gaming-filter').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      root.querySelectorAll('.nh-gaming-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter || 'all';
      root.querySelectorAll('.nh-game-card,.nh-gacha-card').forEach(card => {
        const tags = (card.dataset.tags || 'all').split(/\s+/);
        card.hidden = f !== 'all' && !tags.includes(f);
      });
    });
  });

  root.querySelector('.nh-gaming-pulse')?.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    root.classList.toggle('pulse-active');
  });

  // V22.12 — one RAF-throttled pointer field for the whole archive.
  const interactiveSelector = '.nh-game-card,.nh-gacha-card,.nh-v22-note,.nh-v22-disc,.nh-gaming-stats span';
  let pointerRAF = 0;
  let pointerX = 0;
  let pointerY = 0;
  let pointerInside = false;

  function paintPointerField(){
    pointerRAF = 0;
    const r = root.getBoundingClientRect();
    const x = pointerX - r.left;
    const y = pointerY - r.top;
    root.style.setProperty('--gx', ((x / Math.max(1,r.width))*100).toFixed(2) + '%');
    root.style.setProperty('--gy', ((y / Math.max(1,r.height))*100).toFixed(2) + '%');

    const hit = document.elementFromPoint(pointerX,pointerY);
    const card = hit instanceof Element ? hit.closest(interactiveSelector) : null;

    root.querySelectorAll('.nh-v22-pointer-active').forEach(el=>{
      if(el!==card) el.classList.remove('nh-v22-pointer-active');
    });
    if(card && card.closest('#nhGamingHistory')){
      const box = card.getBoundingClientRect();
      const px = ((pointerX-box.left)/Math.max(1,box.width))*100;
      const py = ((pointerY-box.top)/Math.max(1,box.height))*100;
      card.style.setProperty('--mx',px.toFixed(1)+'%');
      card.style.setProperty('--my',py.toFixed(1)+'%');
      card.classList.add('nh-v22-pointer-active');
    }

    root.classList.toggle('nh-v22-pointer-live',pointerInside);
  }

  root.addEventListener('pointermove', e=>{
    pointerX=e.clientX;
    pointerY=e.clientY;
    pointerInside=true;
    if(!pointerRAF) pointerRAF=requestAnimationFrame(paintPointerField);
  }, {passive:true});

  root.addEventListener('pointerleave', ()=>{
    pointerInside=false;
    root.classList.remove('nh-v22-pointer-live');
  }, {passive:true});

  root.addEventListener('pointerover', e=>{
    const hit=e.target instanceof Element ? e.target.closest(interactiveSelector) : null;
    if(hit && hit.closest('#nhGamingHistory')){
      hit.classList.add('nh-v22-pointer-active');
    }
  }, {passive:true});

  root.addEventListener('pointerout', e=>{
    const hit=e.target instanceof Element ? e.target.closest(interactiveSelector) : null;
    hit?.classList.remove('nh-v22-pointer-active');
  }, {passive:true});

})();