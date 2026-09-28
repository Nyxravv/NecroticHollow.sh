/* V20.0 REMAKE — compact music player */
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
    {title:"Havana — HEAVELY VERSION", artist:"Camila Cabello ft. Young Thug", file:"assets/music/Camilla_Cabello_Ft_Young_Thug_Havana_Cuban_Version_KLICKAUD.mp3"},
    {title:"Jalebi Baby", artist:"Tesher & Jason Derulo", file:"assets/music/Jalebi_Baby_KLICKAUD.mp3"}
  ];

  const dock = document.getElementById('nhMusicDock');
  const playBtn = document.getElementById('nhMusicPlay');
  const openBtn = document.getElementById('nhMusicOpen');
  const modal = document.getElementById('nhMusicModal');
  const closeBtn = document.getElementById('nhMusicClose');
  const listBox = document.getElementById('nhMusicListBox');
  const audio = document.getElementById('nhMusicAudio');
  const titleEl = document.getElementById('nhMusicTitle');
  const statusEl = document.getElementById('nhMusicStatus');
  const volume = document.getElementById('nhMusicVolume');
  const bottomState = document.getElementById('nhMusicBottomState');
  if (!dock || !playBtn || !openBtn || !modal || !closeBtn || !listBox || !audio) return;

  let index = 0;

  function label(track){ return track.artist ? track.title + ' — ' + track.artist : track.title; }

  function renderList(){
    listBox.innerHTML = '';
    playlist.forEach((track,i)=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='nh-track'+(i===index?' active':'');
      btn.innerHTML='<span class="nh-track-num">'+String(i+1).padStart(2,'0')+
        '</span><span><span class="nh-track-name">'+track.title+'</span>'+
        '<span class="nh-track-source">'+(track.artist||'PIANO / INSTRUMENTAL')+
        ' · '+String(i+1).padStart(2,'0')+' / '+String(playlist.length).padStart(2,'0')+
        '</span></span><span class="nh-track-dot" aria-hidden="true"></span>';
      btn.addEventListener('click',()=>selectTrack(i,true));
      listBox.appendChild(btn);
    });
  }

  function showSourceRequired(){
    playBtn.textContent='▶';
    dock.classList.remove('on');
    statusEl.textContent='SOURCE REQUIRED // ADD AUDIO FILE';
    bottomState.textContent='AUDIO SOURCE REQUIRED';
  }

  function selectTrack(i,attemptPlay){
    index=Math.max(0,Math.min(playlist.length-1,i));
    const track=playlist[index];
    titleEl.textContent=label(track);
    statusEl.textContent='LOADING // '+track.file.replace('assets/music/','').toUpperCase();
    bottomState.textContent='TRACK '+String(index+1).padStart(2,'0')+' / '+String(playlist.length).padStart(2,'0');
    audio.src=track.file;
    audio.volume=Number(volume.value||.65);
    renderList();
    if(attemptPlay){
      audio.play().then(()=>{
        playBtn.textContent='Ⅱ';
        dock.classList.add('on');
        statusEl.textContent='PLAYING // '+label(track);
        bottomState.textContent='PLAYING';
      }).catch(showSourceRequired);
    }
  }

  playBtn.addEventListener('click',()=>{
    if(audio.paused){
      audio.play().then(()=>{
        playBtn.textContent='Ⅱ';
        dock.classList.add('on');
        statusEl.textContent='PLAYING // '+label(playlist[index]);
      }).catch(showSourceRequired);
    }else{
      audio.pause();
      playBtn.textContent='▶';
      dock.classList.remove('on');
      statusEl.textContent='PAUSED // '+label(playlist[index]);
      bottomState.textContent='PAUSED';
    }
  });

  volume.addEventListener('input',()=>{ audio.volume=Number(volume.value); });
  audio.addEventListener('ended',()=>{
    if(index<playlist.length-1) selectTrack(index+1,true);
    else {
      playBtn.textContent='▶';
      dock.classList.remove('on');
      statusEl.textContent='END OF PLAYLIST // READY';
      bottomState.textContent='END OF PLAYLIST';
    }
  });
  audio.addEventListener('error',showSourceRequired);

  function openModal(){
    renderList();
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    if(typeof triggerTimeErase==='function') triggerTimeErase();
  }
  function closeModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  openBtn.addEventListener('click',openModal);
  closeBtn.addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' && modal.classList.contains('open')) closeModal();
  });

  selectTrack(0,false);
})();
