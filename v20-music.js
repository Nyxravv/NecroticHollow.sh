/* V20.2 — compact music player / visitor-counter dock / cinematic playlist */
(() => {
  const playlist = [
    {title:"Party Addict", artist:"kets4eki, Nosgov, kojo", file:"assets/music/party_addict_nosgov_kojo_KLICKAUD.mp3"},
    {title:"Bop", artist:"DaBaby", file:"assets/music/BOP_KLICKAUD.mp3"},
    {title:"Freaked Out", artist:"Fat Papi", file:"assets/music/best_part_freaked_out_fat_papi_KLICKAUD.mp3"},
    {title:"Monster", artist:"Skillet", file:"assets/music/Monster_KLICKAUD.mp3"},
    {title:"Drowning Love — Piano Version", artist:"", file:"assets/music/Drowning_Love_Piano_KLICKAUD.mp3"},
    {title:"Love Potions", artist:"BJ Lips, Princess Paparazzi", file:"assets/music/Love_Potions_feat_Princess_Paparazzi_KLICKAUD.mp3"},
    {title:"My Jealousy", artist:"vivi baby & ovg!", file:"assets/music/MY_JEALOUSY_vivi_baby_ovg_KLICKAUD.mp3"},
    {title:"On My Mind", artist:"Fat Papi", file:"assets/music/ON_MY_MIND_KLICKAUD.mp3"},
    {title:"Murder On My Mind", artist:"YNW Melly", file:"assets/music/YNW_Melly_Murder_on_my_mind_bass_boosted_KLICKAUD.mp3"},
    {title:"Havana — HEAVELY VERSION", artist:"Camila Cabello / Young Thug", file:"assets/music/Camilla_Cabello_Ft_Young_Thug_Havana_Cuban_Version_KLICKAUD.mp3"},
    {title:"Jalebi Baby", artist:"Tesher & Jason Derulo", file:"assets/music/Jalebi_Baby_KLICKAUD.mp3"}
  ];

  const dock=document.getElementById('nhMusicDock'),
        playBtn=document.getElementById('nhMusicPlay'),
        openBtn=document.getElementById('nhMusicOpen'),
        modal=document.getElementById('nhMusicModal'),
        closeBtn=document.getElementById('nhMusicClose'),
        listBox=document.getElementById('nhMusicListBox'),
        audio=document.getElementById('nhMusicAudio'),
        titleEl=document.getElementById('nhMusicTitle'),
        statusEl=document.getElementById('nhMusicStatus'),
        volume=document.getElementById('nhMusicVolume'),
        bottomState=document.getElementById('nhMusicBottomState');

  if(!dock||!playBtn||!openBtn||!modal||!closeBtn||!listBox||!audio)return;

  const DEFAULT_VOLUME=0.10;
  let index=0,userPaused=false,autoplayTried=false,unlocked=false;

  const label=t=>t.artist?t.title+' — '+t.artist:t.title;
  const nextTrack=()=>playlist[Math.min(index+1,playlist.length-1)];

  function setVolume(v){
    const n=Math.max(0,Math.min(1,Number(v)));
    audio.volume=n;
    if(volume) volume.value=String(n);
  }

  function renderList(){
    listBox.innerHTML='';
    playlist.forEach((t,i)=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='nh-track'+(i===index?' active':'');
      b.innerHTML='<span class="nh-track-num">'+String(i+1).padStart(2,'0')+
        '</span><span><span class="nh-track-name">'+t.title+'</span>'+
        '<span class="nh-track-source">'+(t.artist||'PIANO / INSTRUMENTAL')+
        ' · '+String(i+1).padStart(2,'0')+' / '+String(playlist.length).padStart(2,'0')+
        '</span></span><span class="nh-track-dot" aria-hidden="true"></span>';
      b.addEventListener('click',()=>selectTrack(i,true));
      listBox.appendChild(b);
    });
  }

  function updateNextAttachment(){
    let el=dock.querySelector('.nh-next-track');
    if(!el){
      el=document.createElement('div');
      el.className='nh-next-track';
      el.setAttribute('aria-hidden','true');
      dock.appendChild(el);
    }
    const n=nextTrack();
    const atEnd=index===playlist.length-1;
    el.innerHTML='<span class="nh-next-kicker">'+(atEnd?'QUEUE // COMPLETE':'NEXT // QUEUED')+'</span>'+
      '<strong>'+n.title+'</strong><small>'+(n.artist||'PIANO / INSTRUMENTAL')+'</small>';
  }

  function sourceError(){
    playBtn.textContent='▶';
    dock.classList.remove('on');
    statusEl.textContent='SOURCE ERROR // AUDIO UNAVAILABLE';
    bottomState.textContent='AUDIO SOURCE CHECK';
  }

  function playingState(){
    playBtn.textContent='Ⅱ';
    dock.classList.add('on');
    statusEl.textContent='PLAYING // '+label(playlist[index]);
    bottomState.textContent='PLAYING';
  }

  function selectTrack(i,play){
    index=Math.max(0,Math.min(playlist.length-1,i));
    const t=playlist[index];
    titleEl.textContent=label(t);
    statusEl.textContent='READY // '+t.title.toUpperCase();
    bottomState.textContent='TRACK '+String(index+1).padStart(2,'0')+' / '+String(playlist.length).padStart(2,'0');
    audio.src=t.file;
    setVolume(volume.value || DEFAULT_VOLUME);
    renderList();
    updateNextAttachment();
    if(play){
      userPaused=false;
      audio.play().then(playingState).catch(sourceError);
    }
  }

  function start(){
    if(!audio.paused||userPaused)return;
    audio.play().then(()=>{
      unlocked=true;
      playingState();
    }).catch(()=>{});
  }

  function tryAutoplay(){
    if(autoplayTried||userPaused)return;
    autoplayTried=true;
    setVolume(DEFAULT_VOLUME);
    audio.play().then(()=>{
      unlocked=true;
      playingState();
    }).catch(()=>{
      statusEl.textContent='READY // TAP / CLICK TO START';
      bottomState.textContent='AUTOPLAY AWAITING BROWSER PERMISSION';
    });
  }

  playBtn.addEventListener('click',()=>{
    if(audio.paused){
      userPaused=false;
      start();
    }else{
      userPaused=true;
      audio.pause();
      playBtn.textContent='▶';
      dock.classList.remove('on');
      statusEl.textContent='PAUSED // '+label(playlist[index]);
      bottomState.textContent='PAUSED';
    }
  });

  volume.addEventListener('input',()=>audio.volume=Number(volume.value));

  audio.addEventListener('ended',()=>{
    if(index<playlist.length-1)selectTrack(index+1,true);
    else{
      playBtn.textContent='▶';
      dock.classList.remove('on');
      statusEl.textContent='END OF PLAYLIST // READY';
      bottomState.textContent='END OF PLAYLIST';
    }
  });

  audio.addEventListener('error',sourceError);

  function openModal(){
    renderList();
    updateNextAttachment();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    if(typeof triggerTimeErase==='function')triggerTimeErase();
  }

  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  openBtn.addEventListener('click',openModal);
  closeBtn.addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeModal();});

  function wrapAndPlaceUnderVisitorCounter(){
    const existingStack=dock.closest('.nh-music-stack');
    const all=[...document.querySelectorAll('body *')].filter(el=>
      el!==dock &&
      !el.classList.contains('nh-music-next') &&
      !el.closest('#nhMusicDock') &&
      (el.textContent||'').trim().replace(/\s+/g,' ').toLowerCase().includes('visitor count')
    );
    if(!all.length)return;

    const counter=all.sort((a,b)=>a.textContent.length-b.textContent.length)[0];
    const counterBox=counter.closest('[class*="counter" i],[id*="counter" i],[class*="visitor" i],[id*="visitor" i]') || counter.closest('section,article,aside,div') || counter;
    if(!counterBox || !counterBox.parentNode)return;

    let stack=existingStack;
    if(!stack){
      stack=document.createElement('div');
      stack.className='nh-music-stack';
    }
    if(stack.parentNode!==counterBox.parentNode || stack.previousElementSibling!==counterBox){
      counterBox.parentNode.insertBefore(stack,counterBox.nextSibling);
    }
    if(dock.parentNode!==stack)stack.appendChild(dock);
    dock.classList.add('v20-under-counter');
  }

  function pointerTilt(e){
    const r=dock.getBoundingClientRect();
    const x=(e.clientX-r.left)/Math.max(1,r.width);
    const y=(e.clientY-r.top)/Math.max(1,r.height);
    dock.style.setProperty('--rx',((0.5-y)*5).toFixed(2)+'deg');
    dock.style.setProperty('--ry',((x-0.5)*6).toFixed(2)+'deg');
  }
  dock.addEventListener('pointermove',pointerTilt);
  dock.addEventListener('pointerleave',()=>{
    dock.style.setProperty('--rx','0deg');
    dock.style.setProperty('--ry','0deg');
  });

  selectTrack(0,false);
  setVolume(DEFAULT_VOLUME);
  updateNextAttachment();

  wrapAndPlaceUnderVisitorCounter();
  requestAnimationFrame(wrapAndPlaceUnderVisitorCounter);
  setTimeout(wrapAndPlaceUnderVisitorCounter,400);
  setTimeout(wrapAndPlaceUnderVisitorCounter,1200);
  setTimeout(tryAutoplay,120);

  ['pointerdown','keydown','touchstart','wheel'].forEach(evt=>{
    document.addEventListener(evt,()=>{
      if(!unlocked)start();
    },{once:true,passive:true});
  });
})();
