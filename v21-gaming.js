/* V21.3 — native details expansion + reactive gaming archive */
(() => {
  const root = document.getElementById('nhGamingHistory');
  if (!root) return;

  const cards = [...root.querySelectorAll('.nh-game-card')];
  const popover = root.querySelector('#nhGameLinkPopover');
  const title = root.querySelector('.nh-game-link-title');
  const urlText = root.querySelector('.nh-game-link-url');
  const copy = root.querySelector('.nh-game-copy');
  const open = root.querySelector('.nh-game-open');
  let selectedUrl = '';

  root.querySelectorAll('.nh-game-card').forEach(card => {
    const toggle = card.querySelector('.nh-game-toggle');
    const icon = card.querySelector('.nh-game-icon');
    const detailLink = card.querySelector('.nh-game-open-detail');

    card.addEventListener('toggle', () => {
      if (toggle) toggle.textContent = card.open ? 'COLLAPSE DETAIL −' : 'EXPAND DETAIL +';
      card.classList.toggle('is-open', card.open);
    });

    icon?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showGameLink(card.dataset.game, card.dataset.url);
    });

    detailLink?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showGameLink(card.dataset.game, card.dataset.url);
    });

    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX-r.left)/Math.max(1,r.width))*100;
      const y = ((e.clientY-r.top)/Math.max(1,r.height))*100;
      card.style.setProperty('--mx', x.toFixed(1)+'%');
      card.style.setProperty('--my', y.toFixed(1)+'%');
      card.style.setProperty('--rx', ((50-y)/22).toFixed(2)+'deg');
      card.style.setProperty('--ry', ((x-50)/28).toFixed(2)+'deg');
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--mx','50%');
      card.style.setProperty('--my','50%');
      card.style.setProperty('--rx','0deg');
      card.style.setProperty('--ry','0deg');
    });
  });

  root.querySelectorAll('.nh-gacha-card').forEach(card => {
    card.addEventListener('toggle', () => {
      const arrow=card.querySelector('.nh-gacha-arrow');
      if(arrow) arrow.textContent=card.open ? '−' : '+';
    });
    card.querySelector('.nh-gacha-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showGameLink(card.dataset.game || card.querySelector('strong')?.textContent || 'GAME', e.currentTarget.dataset.url);
    });
  });

  function showGameLink(game, url) {
    selectedUrl = url || '';
    if (title) title.textContent = game || 'GAME';
    if (urlText) urlText.textContent = selectedUrl.replace(/^https?:\\/\\//,'');
    popover?.classList.add('open');
    popover?.setAttribute('aria-hidden','false');
  }

  function closePopover() {
    popover?.classList.remove('open');
    popover?.setAttribute('aria-hidden','true');
  }

  copy?.addEventListener('click', async () => {
    if (!selectedUrl) return;
    try { await navigator.clipboard.writeText(selectedUrl); copy.textContent='COPIED ✓'; }
    catch { copy.textContent='COPY BLOCKED'; }
    setTimeout(()=>copy.textContent='COPY LINK',1100);
  });

  open?.addEventListener('click', () => {
    if (!selectedUrl) return;
    window.open(selectedUrl,'_blank','noopener,noreferrer');
    closePopover();
  });

  root.querySelector('.nh-gaming-expand-all')?.addEventListener('click', () => {
    cards.forEach(card => { card.open=true; });
  });
  root.querySelector('.nh-gaming-collapse-all')?.addEventListener('click', () => {
    cards.forEach(card => { card.open=false; });
  });

  root.querySelectorAll('.nh-gaming-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      root.querySelectorAll('.nh-gaming-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const f=btn.dataset.filter;
      cards.forEach(card => {
        const tags=(card.dataset.tags||'').split(/\\s+/);
        card.hidden=f!=='all' && !tags.includes(f);
      });
    });
  });

  const pulse = root.querySelector('.nh-gaming-pulse');
  pulse?.addEventListener('click', () => root.classList.toggle('pulse-active'));

  root.addEventListener('pointermove', e => {
    const r=root.getBoundingClientRect();
    const x=((e.clientX-r.left)/Math.max(1,r.width))*100;
    const y=((e.clientY-r.top)/Math.max(1,r.height))*100;
    root.style.setProperty('--gx',x.toFixed(1)+'%');
    root.style.setProperty('--gy',y.toFixed(1)+'%');
  });

  root.querySelectorAll('.nh-game-card,.nh-gacha-card,.nh-gaming-filter,.nh-gaming-action').forEach(el => {
    el.addEventListener('pointerenter',()=>el.style.setProperty('--hovered','1'));
    el.addEventListener('pointerleave',()=>el.style.setProperty('--hovered','0'));
  });

  popover?.addEventListener('click', e => { if(e.target===popover) closePopover(); });
  popover?.querySelector('.nh-game-link-close')?.addEventListener('click', closePopover);
  document.addEventListener('keydown', e => { if(e.key==='Escape') closePopover(); });
})();