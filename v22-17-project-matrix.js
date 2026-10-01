/* V22.19 — interactive Project Matrix motion showcase */
(() => {
  const items = [
    {title:'ROOFTOP // SPARRING', kicker:'MOTION STUDY 01', sub:'ROBLOX RIGS / CINEMATIC CHOREOGRAPHY', detail:'A stylized, non-graphic two-rig sparring sequence with dramatic camera framing, impact timing, and neon-lit atmosphere.'},
    {title:'VOID // AWAKENING', kicker:'MOTION STUDY 02', sub:'CHARACTER RIG / ENERGY REVEAL', detail:'A character-presentation sequence built around a slow reveal, expressive posing, and animated environmental light.'},
    {title:'NEON // DUEL', kicker:'MOTION STUDY 03', sub:'TWO-RIG PERFORMANCE / ANIME-INSPIRED', detail:'A short choreographed face-off between two original block-style rigs, emphasizing movement and cinematic staging.'},
    {title:'HOLLOW // ASCENSION', kicker:'MOTION STUDY 04', sub:'BLENDER-STYLE RIG / FINISHING POSE', detail:'A dramatic character animation study with a rising camera, shifting light, and a final hero pose.'}
  ];
  const rig = (side='a') => `<div class="nh-v2219-rig nh-v2219-${side}" aria-hidden="true"><i class="rig-head"></i><i class="rig-body"></i><i class="rig-arm rig-arm-a"></i><i class="rig-arm rig-arm-b"></i><i class="rig-leg rig-leg-a"></i><i class="rig-leg rig-leg-b"></i></div>`;
  function card(item,index){
    return `<button type="button" class="nh-v2217-card nh-v2219-card" data-motion-index="${index}" aria-label="Open animated showcase: ${item.title}">
      <span class="nh-v2217-scene nh-v2219-scene"><span class="nh-v2217-grid"></span><span class="nh-v2217-ring"></span><span class="nh-v2217-scan"></span><span class="nh-v2219-stage"></span>${rig('a')}${index===0||index===2?rig('b'):''}<span class="nh-v2219-flash"></span></span>
      <span class="nh-v2217-play" aria-hidden="true"></span>
      <span class="nh-v2217-meta"><span class="nh-v2217-kicker">${item.kicker} // 0${index+1}</span><span class="nh-v2217-title">${item.title}</span><span class="nh-v2217-sub">${item.sub}</span></span>
    </button>`;
  }
  function findProjectGrid(){
    // The source layout uses .project-window-grid (not #blenderProjectGrid).
    const direct=document.getElementById('blenderProjectGrid')
      ||document.querySelector('.blender-project-grid')
      ||document.querySelector('.project-window-grid');
    if(direct)return direct;
    const sections=[...document.querySelectorAll('section, .section, [id]')];
    const matrix=sections.find(el=>/PROJECT\s+MATRIX/i.test(el.textContent||''));
    if(matrix)return matrix.querySelector('.project-window-grid, .project-grid, .projects-grid, .blender-projects, .project-matrix-grid, .grid, [class*="project"]')||null;
    return null;
  }
  function init(){
    const grid=findProjectGrid(); if(!grid||grid.dataset.nh2219==='1')return false;
    grid.dataset.nh2219='1'; grid.classList.add('nh-v2217-gallery'); grid.innerHTML=items.map(card).join('');
    const modal=document.createElement('div'); modal.className='nh-v2219-modal'; modal.hidden=true; modal.setAttribute('aria-hidden','true');
    modal.innerHTML='<div class="nh-v2219-dialog" role="dialog" aria-modal="true" aria-labelledby="nh2219-title"><button class="nh-v2219-close" type="button" aria-label="Close showcase">×</button><div class="nh-v2219-modal-scene"></div><div class="nh-v2219-copy"><small class="nh-v2217-kicker" id="nh2219-kicker"></small><h3 id="nh2219-title"></h3><p id="nh2219-detail"></p><span class="nh-v2219-note">ANIMATED VISUAL STUDY // ORIGINAL CSS RIG PREVIEW</span></div></div>';
    document.body.appendChild(modal);
    const close=()=>{modal.hidden=true;modal.setAttribute('aria-hidden','true');document.body.classList.remove('nh-v2219-open')};
    grid.addEventListener('click',e=>{const btn=e.target.closest('[data-motion-index]');if(!btn)return;const i=Number(btn.dataset.motionIndex),item=items[i];if(!item)return;
      const scene=modal.querySelector('.nh-v2219-modal-scene');scene.innerHTML=rig('a')+(i===0||i===2?rig('b'):'')+'<span class="nh-v2219-stage"></span><span class="nh-v2219-flash"></span>';
      modal.querySelector('#nh2219-kicker').textContent=item.kicker;modal.querySelector('#nh2219-title').textContent=item.title;modal.querySelector('#nh2219-detail').textContent=item.detail;
      modal.hidden=false;modal.setAttribute('aria-hidden','false');document.body.classList.add('nh-v2219-open');modal.querySelector('.nh-v2219-close').focus();
    });
    modal.querySelector('.nh-v2219-close').addEventListener('click',close);
    modal.addEventListener('click',e=>{if(e.target===modal)close()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
  }
  const boot=()=>{if(init())return;const observer=new MutationObserver(()=>{if(init())observer.disconnect()});observer.observe(document.documentElement,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();