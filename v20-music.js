/* V20.4 — music player hard placement + reactive VFX */
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
  let index=0,userPaused=false,unlocked=false,placing=false;

  const label=t=>t.artist?t.title+' — '+t.artist;
  const nextTrack=()=>playlist[Math.min(index+1,playlist.length-1)];

  function setVolume(v){
    const n=Math.max(0,Math.min(1,Number(v)));
    audio.volume=n;
    if(volume)volume.value=String(n);
  }

  function addSparkles(){
    if(dock.querySelector('.nh-spark-field'))return;
    const field=document.createElement('div');
    field.className='nh-spark-field';
    for(let i=0;i<12;i++){
      const s=document.createElement('i');
      s.className='nh-spark s'+i;
      s.setAttribute('aria-hidden','true');
      field.appendChild(s);
    }
    dock.appendChild(field);
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
    const atEnd=index===playlist.length-1;
    const n=nextTrack();
    el.innerHTML='<span class="nh-next-kicker">'+(atEnd?'QUEUE // COMPLETE':'NEXT // QUEUED')+
      '</span><strong>'+n.title+'</strong><small>'+(n.artist||'PIANO / INSTRUMENTAL')+'</small>';
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
    audio.play().then(()=>{unlocked=true;playingState();}).catch(()=>{});
  }

  function tryAutoplay(){
    if(userPaused)return;
    setVolume(DEFAULT_VOLUME);
    audio.play().then(()=>{unlocked=true;playingState();}).catch(()=>{
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

  function findVisitorCounterBox(){
    const hits=[...document.querySelectorAll('body *')].filter(el=>{
      if(el===dock||el.closest('#nhMusicDock'))return false;
      const txt=(el.textContent||'').trim().replace(/\s+/g,' ').toLowerCase();
      return txt.includes('visitor count');
    });
    if(!hits.length)return null;

    const seed=hits.sort((a,b)=>a.textContent.length-b.textContent.length)[0];
    const candidates=[];
    let el=seed;

    for(let depth=0;el&&depth<10;depth++,el=el.parentElement){
      if(el===document.body||el===document.documentElement)break;
      const r=el.getBoundingClientRect();
      const cs=getComputedStyle(el);
      if(r.width<240||r.width>700||r.height<70||r.height>240)continue;
      if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity||1)===0)continue;

      const hasBorder=['borderTopWidth','borderRightWidth','borderBottomWidth','borderLeftWidth']
        .some(k=>parseFloat(cs[k])>0);
      const rounded=['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius']
        .some(k=>parseFloat(cs[k])>0);

      let score=r.width*r.height;
      if(hasBorder)score+=900000;
      if(rounded)score+=250000;
      candidates.push({el,score});
    }

    if(!candidates.length)return seed;
    candidates.sort((a,b)=>b.score-a.score);
    return candidates[0].el;
  }

  function hardPlaceBelowCounter(){
    if(placing)return;
    const counter=findVisitorCounterBox();
    if(!counter)return;
    placing=true;

    const rect=counter.getBoundingClientRect();
    const scrollX=window.scrollX||window.pageXOffset;
    const scrollY=window.scrollY||window.pageYOffset;

    const width=Math.min(360,Math.max(250,Math.min(rect.width-8,window.innerWidth-28)));
    const left=Math.max(14,Math.min(
      scrollX+rect.left+(rect.width-width)/2,
      scrollX+window.innerWidth-width-14
    ));
    const top=scrollY+rect.bottom+16;

    dock.classList.add('v20-fixed-placement');
    dock.style.width=width+'px';
    dock.style.left=left+'px';
    dock.style.top=top+'px';

    if(dock.parentNode!==document.body)document.body.appendChild(dock);
    placing=false;
  }

  function pointerTilt(e){
    const r=dock.getBoundingClientRect();
    const x=(e.clientX-r.left)/Math.max(1,r.width);
    const y=(e.clientY-r.top)/Math.max(1,r.height);
    dock.style.setProperty('--rx',((0.5-y)*5).toFixed(2)+'deg');
    dock.style.setProperty('--ry',((x-0.5)*7).toFixed(2)+'deg');
  }

  dock.addEventListener('pointermove',pointerTilt);
  dock.addEventListener('pointerleave',()=>{
    dock.style.setProperty('--rx','0deg');
    dock.style.setProperty('--ry','0deg');
  });

  selectTrack(0,false);
  setVolume(DEFAULT_VOLUME);
  updateNextAttachment();
  addSparkles();

  hardPlaceBelowCounter();
  requestAnimationFrame(hardPlaceBelowCounter);
  setTimeout(hardPlaceBelowCounter,350);
  setTimeout(hardPlaceBelowCounter,900);
  window.addEventListener('resize',hardPlaceBelowCounter,{passive:true});
  window.addEventListener('scroll',hardPlaceBelowCounter,{passive:true});

  setTimeout(tryAutoplay,120);

  ['pointerdown','keydown','touchstart','wheel'].forEach(evt=>{
    document.addEventListener(evt,()=>{if(!unlocked)start();},{once:true,passive:true});
  });
})();
