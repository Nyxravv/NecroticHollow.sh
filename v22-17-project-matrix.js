/* V22.17 — animated Project Matrix gallery */
(() => {
  const items = [
    {
      title: 'BLENDER // ROBLOX SHOWCASE',
      kicker: 'MOTION TEST 01',
      sub: 'UGC / CHARACTER PRESENTATION / BLENDER',
      url: 'https://www.youtube.com/watch?v=3faSPepXWNg'
    },
    {
      title: 'SPACESHIP // CINEMATIC',
      kicker: 'MOTION TEST 02',
      sub: 'BLENDER ANIMATION / ROBLOX SHOWCASE',
      url: 'https://devforum.roblox.com/t/sci-fi-spaceship-interior-animation-and-showcase/1720098'
    },
    {
      title: 'SPIRITED AWAY // SHOWCASE',
      kicker: 'MOTION TEST 03',
      sub: 'BLENDER / ROBLOX ENVIRONMENT / ANIMATION',
      url: 'https://devforum.roblox.com/t/spirited-away-showcase/936073'
    },
    {
      title: 'ANIME MOVEMENT // SYSTEM',
      kicker: 'MOTION TEST 04',
      sub: 'ROBLOX ANIMATION / MOVEMENT SHOWCASE',
      url: 'https://devforum.roblox.com/t/anime-movement-system-open-source/1553138'
    }
  ];

  function card(item, index) {
    return `<a class="nh-v2217-card" href="${item.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${item.title}">
      <div class="nh-v2217-scene">
        <div class="nh-v2217-grid"></div>
        <div class="nh-v2217-ring"></div>
        <div class="nh-v2217-core"></div>
        <div class="nh-v2217-scan"></div>
      </div>
      <div class="nh-v2217-play" aria-hidden="true"></div>
      <div class="nh-v2217-meta">
        <div class="nh-v2217-kicker">${item.kicker} // 0${index + 1}</div>
        <div class="nh-v2217-title">${item.title}</div>
        <div class="nh-v2217-sub">${item.sub}</div>
      </div>
    </a>`;
  }

  function init() {
    const grid = document.getElementById('blenderProjectGrid');
    if (!grid) return;
    grid.classList.add('nh-v2217-gallery');
    grid.innerHTML = items.map(card).join('');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
