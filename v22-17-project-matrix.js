/* V22.20 — credited YouTube showcases in Project Matrix */
(() => {
  const items = [
    {id:'KTAQvNiNP1g', title:'ROOFTOP // SPARRING', kicker:'MOTION STUDY 01', sub:'ROBLOX RIGS / CINEMATIC CHOREOGRAPHY', detail:'Featured animation video. Open the original source to view the creator, description, and full context.'},
    {id:'2v-EwewqxTQ', title:'VOID // AWAKENING', kicker:'MOTION STUDY 02', sub:'CHARACTER RIG / ENERGY REVEAL', detail:'Featured animation video. Open the original source to view the creator, description, and full context.'},
    {id:'tbsymX_D9PI', title:'NEON // DUEL', kicker:'MOTION STUDY 03', sub:'TWO-RIG PERFORMANCE / ANIME-INSPIRED', detail:'Featured animation video. Open the original source to view the creator, description, and full context.'},
    {id:'PaCQ7pqESWA', title:'HOLLOW // ASCENSION', kicker:'MOTION STUDY 04', sub:'BLENDER-STYLE RIG / FINISHING POSE', detail:'Featured animation video. Open the original source to view the creator, description, and full context.'}
  ];
  const watch = item => 'https://www.youtube.com/watch?v='+item.id;
  const embed = item => 'https://www.youtube-nocookie.com/embed/'+item.id+'?autoplay=1&rel=0';
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function card(item,index){
    return `<button type="button" class="nh-v2217-card nh-v2219-card nh-v2220-card" data-motion-index="${index}" aria-label="Play video: ${esc(item.title)}">
      <span class="nh-v2217-scene nh-v2219-scene nh-v2220-thumb"><img loading="lazy" src="https://i.ytimg.com/vi/${item.id}/hqdefault.jpg" alt="" onerror="this.style.display='none'"><span class="nh-v2217-grid"></span><span class="nh-v2217-scan"></span><span class="nh-v2220-playlabel">PLAY VIDEO</span></span>
      <span class="nh-v2217-play" aria-hidden="true"></span>
      <span class="nh-v2217-meta"><span class="nh-v2217-kicker">${item.kicker} // 0${index+1}</span><span class="nh-v2217-title">${esc(item.title)}</span><span class="nh-v2217-sub">${esc(item.sub)}</span><span class="nh-v2220-credit" data-credit-index="${index}">CREATOR CREDIT // OPEN SOURCE</span></span>
    </button>`;
  }
  function findProjectGrid(){
    return document.getElementById('blenderProjectGrid')
      ||document.querySelector('.blender-project-grid')
      ||document.querySelector('.project-window-grid-empty')
      ||document.querySelector('.project-window-grid');
  }
  async function loadCredits(){
    items.forEach(async(item,index)=>{
      try{
        const response=await fetch('https://www.youtube.com/oembed?url='+encodeURIComponent(watch(item))+'&format=json');
        if(!response.ok)throw new Error('metadata unavailable');
        const data=await response.json();
        const credit=document.querySelector('[data-credit-index="'+index+'"]');
        if(credit)credit.textContent='BY '+(data.author_name||'YOUTUBE CREATOR');
      }catch(_){/* Source link remains available if public metadata is unavailable. */}
    });
  }
  function init(){
    const grid=findProjectGrid(); if(!grid||grid.dataset.nh2220==='1')return false;
    grid.dataset.nh2220='1';
    const heading=document.createElement('div');heading.className='nh-v2220-heading';
    heading.innerHTML='<span class="nh-v2220-heading-title">MY WORK</span><span class="nh-v2220-heading-note">DISCORD COMMUNITY // SERVER OWNER</span>';
    grid.parentNode.insertBefore(heading,grid);
    grid.classList.add('nh-v2217-gallery');grid.innerHTML=items.map(card).join('');
    const modal=document.createElement('div');modal.className='nh-v2219-modal nh-v2220-modal';modal.hidden=true;modal.setAttribute('aria-hidden','true');
    modal.innerHTML='<div class="nh-v2219-dialog nh-v2220-dialog" role="dialog" aria-modal="true" aria-labelledby="nh2220-title"><button class="nh-v2219-close" type="button" aria-label="Close video viewer">×</button><div class="nh-v2220-player"></div><div class="nh-v2219-copy nh-v2220-copy"><small class="nh-v2217-kicker" id="nh2220-kicker"></small><h3 id="nh2220-title"></h3><p id="nh2220-detail"></p><p class="nh-v2220-creator" id="nh2220-creator">Creator: see original YouTube source</p><div class="nh-v2220-actions"><a class="nh-v2220-action" id="nh2220-source" target="_blank" rel="noopener noreferrer">OPEN SOURCE</a><button class="nh-v2220-action" id="nh2220-copy" type="button">COPY LINK</button></div><span class="nh-v2219-note">VIDEO EMBED // ORIGINAL CREATOR RETAINS CREDIT</span></div></div>';
    document.body.appendChild(modal);
    const close=()=>{modal.hidden=true;modal.setAttribute('aria-hidden','true');modal.querySelector('.nh-v2220-player').replaceChildren();document.body.classList.remove('nh-v2219-open')};
    grid.addEventListener('click',async e=>{
      const btn=e.target.closest('[data-motion-index]');if(!btn)return;
      const i=Number(btn.dataset.motionIndex),item=items[i];if(!item)return;
      const player=modal.querySelector('.nh-v2220-player');
      const frame=document.createElement('iframe');frame.src=embed(item);frame.title='YouTube video: '+item.title;frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';player.replaceChildren(frame);
      modal.querySelector('#nh2220-kicker').textContent=item.kicker+' // 0'+(i+1);
      modal.querySelector('#nh2220-title').textContent=item.title;modal.querySelector('#nh2220-detail').textContent=item.detail;
      const source=modal.querySelector('#nh2220-source');source.href=watch(item);
      const creator=modal.querySelector('#nh2220-creator');creator.textContent='Creator: loading YouTube attribution…';
      try{const r=await fetch('https://www.youtube.com/oembed?url='+encodeURIComponent(watch(item))+'&format=json');if(!r.ok)throw new Error();const d=await r.json();creator.textContent='Original creator: '+(d.author_name||'YouTube channel');}
      catch(_){creator.textContent='Original creator: see channel on YouTube';}
      modal.hidden=false;modal.setAttribute('aria-hidden','false');document.body.classList.add('nh-v2219-open');modal.querySelector('.nh-v2219-close').focus();
    });
    modal.querySelector('.nh-v2219-close').addEventListener('click',close);
    modal.querySelector('#nh2220-copy').addEventListener('click',async()=>{
      const i=Number(modal.querySelector('#nh2220-kicker').textContent.match(/0([1-4])/ )?.[1]||1)-1;
      const button=modal.querySelector('#nh2220-copy');
      try{await navigator.clipboard.writeText(watch(items[i]));button.textContent='COPIED';setTimeout(()=>button.textContent='COPY LINK',1400);}
      catch(_){button.textContent='USE OPEN SOURCE';}
    });
    modal.addEventListener('click',e=>{if(e.target===modal)close()});
    modal.querySelector('.nh-v2220-dialog').addEventListener('click',e=>e.stopPropagation());
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)close()});
    loadCredits();return true;
  }
  const boot=()=>{if(init())return;const observer=new MutationObserver(()=>{if(init())observer.disconnect()});observer.observe(document.documentElement,{childList:true,subtree:true});};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();