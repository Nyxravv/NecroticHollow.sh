/* V20.5 — clean compact music player */
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
        listEl=document.getElementById('nhMusicNext'),
        audio=document.getElementById('nhMusicAudio'),
        titleEl=document.getElementById('nhMusicTitle'),
        statusEl=document.getElementById('nhMusicStatus'),
        volume=document.getElementById('nhMusicVolume');

  if(!dock||!playBtn||!openBtn||!listEl||!audio||!titleEl||!statusEl||!volume)return;

  const DEFAULT_VOLUME=0.08;
  let index=0;
  let userPaused=false;
  let started=false;

  const label=t=>t.artist ? t.title+' — '+t.artist : t.title;

  function setVolume(v){
    const n=Math.max(0,Math.min(1,Number(v)));
    audio.volume=n;
    volume.value=String(n);
  }

  function nextLabel(){
    if(index>=playlist.length-1)return 'END OF QUEUE';
    const n=playlist[index+1];
    return n.artist ? n.title+' — '+n.artist : n.title;
  }

  function renderNext(){
    if(index>=playlist.length-1){
      listEl.innerHTML='<span>NEXT // QUEUE COMPLETE</span>';
      return;
    }
    const n=playlist[index+1];
    listEl.innerHTML='<span>NEXT // QUEUED</span><strong>'+n.title+'</strong><small>'+n.artist+'</small>';
  }

  function statePlaying(){
    playBtn.textContent='Ⅱ';
    dock.classList.add('is-playing');
    statusEl.textContent='PLAYING // '+label(playlist[index]);
  }

  function statePaused(){
    playBtn.textContent='▶';
    dock.classList.remove('is-playing');
    statusEl.textContent='PAUSED // '+label(playlist[index]);
  }

  function loadTrack(i,play){
    index=Math.max(0,Math.min(playlist.length-1,i));
    const t=playlist[index];
    titleEl.textContent=label(t);
    audio.src=t.file;
    setVolume(volume.value || DEFAULT_VOLUME);
    renderNext();
    statusEl.textContent='READY // '+String(index+1).padStart(2,'0')+' / '+String(playlist.length).padStart(2,'0');
    if(play){
      userPaused=false;
      audio.play().then(()=>{
        started=true;
        statePlaying();
      }).catch(()=>{
        statusEl.textContent='READY // CLICK PLAY';
      });
    }
  }

  function tryStart(){
    if(userPaused||started)return;
    audio.play().then(()=>{
      started=true;
      statePlaying();
    }).catch(()=>{
      statusEl.textContent='READY // CLICK PLAY';
    });
  }

  playBtn.addEventListener('click',()=>{
    if(audio.paused){
      userPaused=false;
      audio.play().then(()=>{
        started=true;
        statePlaying();
      }).catch(()=>{
        statusEl.textContent='READY // CLICK PLAY';
      });
    }else{
      userPaused=true;
      audio.pause();
      statePaused();
    }
  });

  volume.addEventListener('input',()=>audio.volume=Number(volume.value));

  audio.addEventListener('ended',()=>{
    if(index<playlist.length-1){
      loadTrack(index+1,true);
    }else{
      userPaused=true;
      statePaused();
      statusEl.textContent='END OF QUEUE';
    }
  });

  audio.addEventListener('error',()=>{
    playBtn.textContent='▶';
    dock.classList.remove('is-playing');
    statusEl.textContent='AUDIO SOURCE ERROR';
  });

  function buildModal(){
    const modal=document.createElement('div');
    modal.id='nhMusicModal';
    modal.className='nh-music-modal-v205';
    modal.innerHTML=
      '<div class="nh-music-window-v205" role="dialog" aria-modal="true" aria-label="Music playlist">'+
        '<button class="nh-music-close-v205" type="button" aria-label="Close playlist">×</button>'+
        '<div class="nh-music-modal-kicker">MUSIC // PERSONAL QUEUE</div>'+
        '<h2>NECROTIC<span>HOLLOW</span> // PLAYLIST</h2>'+
        '<p class="nh-music-modal-copy">CLICK A TRACK TO LOAD IT · LOW START VOLUME // 08%</p>'+
        '<div class="nh-music-track-list"></div>'+
      '</div>';

    const trackList=modal.querySelector('.nh-music-track-list');
    playlist.forEach((t,i)=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='nh-music-track-v205'+(i===index?' active':'');
      b.innerHTML='<b>'+String(i+1).padStart(2,'0')+'</b><span><strong>'+t.title+'</strong><small>'+((t.artist)||'PIANO / INSTRUMENTAL')+'</small></span><i>↗</i>';
      b.addEventListener('click',()=>loadTrack(i,true));
      trackList.appendChild(b);
    });

    const close=()=>{
      modal.classList.remove('open');
      setTimeout(()=>modal.remove(),220);
    };
    modal.querySelector('.nh-music-close-v205').addEventListener('click',close);
    modal.addEventListener('click',e=>{if(e.target===modal)close();});
    document.addEventListener('keydown',e=>{
      if(e.key==='Escape'&&document.body.contains(modal))close();
    },{once:true});

    document.body.appendChild(modal);
    requestAnimationFrame(()=>modal.classList.add('open'));
  }

  openBtn.addEventListener('click',buildModal);

  dock.addEventListener('pointermove',e=>{
    const r=dock.getBoundingClientRect();
    const x=(e.clientX-r.left)/Math.max(1,r.width)-.5;
    const y=(e.clientY-r.top)/Math.max(1,r.height)-.5;
    dock.style.setProperty('--tilt-x',(-y*3.5).toFixed(2)+'deg');
    dock.style.setProperty('--tilt-y',(x*5).toFixed(2)+'deg');
  });
  dock.addEventListener('pointerleave',()=>{
    dock.style.setProperty('--tilt-x','0deg');
    dock.style.setProperty('--tilt-y','0deg');
  });

  loadTrack(0,false);
  setVolume(DEFAULT_VOLUME);
  renderNext();

  // Browsers may block audible autoplay. Keep the first attempt quiet, then start on the first interaction.
  setTimeout(tryStart,140);
  ['pointerdown','keydown','touchstart'].forEach(evt=>{
    document.addEventListener(evt,tryStart,{once:true,passive:true});
  });
})();
