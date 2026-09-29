/* V21.5 — cinematic gaming viewer / reliable external links */
(() => {
  const root=document.getElementById('nhGamingHistory');
  if(!root)return;
  const cards=[...root.querySelectorAll('.nh-game-card,.nh-gacha-card')];
  const viewer=root.querySelector('#nhGameViewer');
  const panel=viewer?.querySelector('.nh-game-viewer-panel');
  const img=root.querySelector('#nhViewerImg');
  const kicker=root.querySelector('#nhViewerKicker');
  const title=root.querySelector('#nhViewerTitle');
  const subtitle=root.querySelector('#nhViewerSubtitle');
  const edition=root.querySelector('#nhViewerEdition');
  const price=root.querySelector('#nhViewerPrice');
  const details=root.querySelector('#nhViewerDetails');
  const desc=root.querySelector('#nhViewerDesc');
  const why=root.querySelector('#nhViewerWhy');
  const source=root.querySelector('#nhViewerSource');
  const openLink=root.querySelector('#nhViewerOpen');
  const copyBtn=root.querySelector('.nh-viewer-copy');
  const closeBtn=root.querySelector('.nh-game-viewer-close');
  let selectedUrl='';

  function decodeDetails(card){
    try{
      return JSON.parse(card.dataset.details||'[]');
    }catch{
      return [];
    }
  }

  function openViewer(card){
    if(!viewer)return;
    selectedUrl=card.dataset.url||'';
    img.src=card.dataset.img||'';
    img.alt=(card.dataset.game||'GAME')+' artwork';
    kicker.textContent=card.dataset.kind==='gacha'?'GACHA ARCHIVE // CINEMATIC VIEWER':'GAME ARCHIVE // CINEMATIC VIEWER';
    title.textContent=card.dataset.game||'GAME';
    subtitle.textContent=card.dataset.subtitle||'';
    edition.textContent=card.dataset.edition||'';
    price.textContent=card.dataset.price||'CHECK STORE';
    desc.textContent=card.dataset.desc||'';
    why.textContent=card.dataset.why||'';
    source.textContent=card.dataset.source||'';
    details.innerHTML='';
    decodeDetails(card).forEach(pair=>{
      const box=document.createElement('span');
      box.innerHTML='<small>'+pair[0]+'</small><strong>'+pair[1]+'</strong>';
      details.appendChild(box);
    });
    openLink.href=selectedUrl||'#';
    viewer.classList.add('open');
    viewer.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    requestAnimationFrame(()=>panel?.classList.add('ready'));
  }

  function closeViewer(){
    if(!viewer)return;
    panel?.classList.remove('ready');
    viewer.classList.remove('open');
    viewer.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  cards.forEach(card=>{
    card.addEventListener('click',e=>{
      e.preventDefault();
      openViewer(card);
    });
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const x=((e.clientX-r.left)/Math.max(1,r.width))*100;
      const y=((e.clientY-r.top)/Math.max(1,r.height))*100;
      card.style.setProperty('--mx',x.toFixed(1)+'%');
      card.style.setProperty('--my',y.toFixed(1)+'%');
      card.style.setProperty('--rx',((50-y)/18).toFixed(2)+'deg');
      card.style.setProperty('--ry',((x-50)/22).toFixed(2)+'deg');
      card.style.setProperty('--hovered','1');
    });
    card.addEventListener('pointerleave',()=>{
      card.style.setProperty('--mx','50%');
      card.style.setProperty('--my','50%');
      card.style.setProperty('--rx','0deg');
      card.style.setProperty('--ry','0deg');
      card.style.setProperty('--hovered','0');
    });
  });

  root.querySelectorAll('.nh-gaming-filter').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      root.querySelectorAll('.nh-gaming-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter=btn.dataset.filter;
      cards.forEach(card=>{
        const tags=(card.dataset.tags||'all').split(/\s+/);
        card.hidden=filter!=='all'&&!tags.includes(filter);
      });
    });
  });

  root.querySelector('.nh-gaming-pulse')?.addEventListener('click',()=>{
    root.classList.toggle('pulse-active');
  });

  root.addEventListener('pointermove',e=>{
    const r=root.getBoundingClientRect();
    const x=((e.clientX-r.left)/Math.max(1,r.width))*100;
    const y=((e.clientY-r.top)/Math.max(1,r.height))*100;
    root.style.setProperty('--gx',x.toFixed(1)+'%');
    root.style.setProperty('--gy',y.toFixed(1)+'%');
  });

  closeBtn?.addEventListener('click',closeViewer);
  viewer?.addEventListener('click',e=>{if(e.target===viewer)closeViewer();});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&viewer?.classList.contains('open'))closeViewer();
  });

  copyBtn?.addEventListener('click',async()=>{
    if(!selectedUrl)return;
    try{
      await navigator.clipboard.writeText(selectedUrl);
      copyBtn.textContent='COPIED ✓';
    }catch{
      const area=document.createElement('textarea');
      area.value=selectedUrl;
      area.style.position='fixed';
      area.style.opacity='0';
      document.body.appendChild(area);
      area.select();
      try{document.execCommand('copy');copyBtn.textContent='COPIED ✓';}
      catch{copyBtn.textContent='COPY BLOCKED';}
      area.remove();
    }
    setTimeout(()=>{copyBtn.textContent='COPY LINK';},1100);
  });
})();