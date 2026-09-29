from pathlib import Path
import re

index = Path("index.html")
html = index.read_text(encoding="utf-8")

CSS = '<link rel="stylesheet" href="v21-gaming.css">'
JS = '<script src="v21-gaming.js"></script>'

section = r'''
<section class="section nh-gaming-section" id="gaming-history">
  <div class="nh-gaming-shell">
    <div class="nh-gaming-topline">
      <span>08 // GAMING ARCHIVE</span>
      <strong>NON-CYBERPUNK INTERESTS // SIGNAL PRESERVED</strong>
    </div>

    <div class="nh-gaming-heading">
      <div>
        <div class="nh-gaming-kicker">PERSONAL ARCHIVE // GAME HISTORY</div>
        <h2>MY GAMING<br/><em>HISTORY.</em></h2>
        <p>
          A separate branch of the archive for the games I come back to, explore, study,
          and get inspired by outside of Cyberpunk. Expand a title to open its detail layer.
          Click a game image for the external-link controls.
        </p>
      </div>

      <div class="nh-gaming-stats">
        <div class="nh-gaming-stat"><span>ARCHIVED</span><b>07 GAMES</b></div>
        <div class="nh-gaming-stat"><span>MODE</span><b>INTERACTIVE</b></div>
        <div class="nh-gaming-stat"><span>VISUAL</span><b>NEON / GLOW</b></div>
      </div>
    </div>

    <div class="nh-gaming-controls">
      <div class="nh-gaming-filter-row">
        <button class="nh-gaming-filter active" data-filter="all">ALL</button>
        <button class="nh-gaming-filter" data-filter="openworld">OPEN WORLD</button>
        <button class="nh-gaming-filter" data-filter="action">ACTION</button>
        <button class="nh-gaming-filter" data-filter="souls">SOULS-LIKE</button>
        <button class="nh-gaming-filter" data-filter="2d">2D</button>
      </div>
      <div class="nh-gaming-action-row">
        <button class="nh-gaming-action nh-gaming-pulse" type="button">VFX // WAKE</button>
        <button class="nh-gaming-action nh-gaming-expand-all" type="button">EXPAND ALL</button>
        <button class="nh-gaming-action nh-gaming-collapse-all" type="button">COLLAPSE ALL</button>
      </div>
    </div>

    <div class="nh-game-grid">
      <article class="nh-game-card" data-tags="all openworld action" data-game="Ghost of Tsushima" data-url="https://store.steampowered.com/app/2215430/Ghost_of_Tsushima_DIRECTORS_CUT/" aria-expanded="false">
        <div class="nh-game-body">
          <button class="nh-game-icon" type="button" aria-label="Ghost of Tsushima link options"><img loading="lazy" alt="Ghost of Tsushima game artwork" src="https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/header.jpg"/></button>
          <div class="nh-game-copy">
            <div class="nh-game-index">01 // OPEN WORLD</div>
            <h3 class="nh-game-title"><span>GHOST OF TSUSHIMA</span></h3>
            <div class="nh-game-meta">SUCKER PUNCH // NIXes // ACTION-ADVENTURE</div>
            <button class="nh-game-expand" type="button">EXPAND DETAIL</button>
          </div>
        </div>
        <div class="nh-game-details">
          <div class="nh-game-details-grid">
            <div class="nh-game-detail-box"><span>STYLE</span><b>OPEN WORLD</b></div>
            <div class="nh-game-detail-box"><span>FOCUS</span><b>SAMURAI / EXPLORATION</b></div>
            <div class="nh-game-detail-box"><span>PC PAGE</span><b>STEAM STORE</b></div>
          </div>
          <p>An open-world action adventure centered on exploration, combat, and Jin Sakai's journey through Tsushima. The PC edition is the DIRECTOR'S CUT, published by PlayStation Publishing.</p>
        </div>
      </article>

      <article class="nh-game-card" data-tags="all openworld action souls" data-game="ELDEN RING" data-url="https://store.steampowered.com/app/1245620/ELDEN_RING/" aria-expanded="false">
        <div class="nh-game-body">
          <button class="nh-game-icon" type="button" aria-label="ELDEN RING link options"><img loading="lazy" alt="ELDEN RING game artwork" src="https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg"/></button>
          <div class="nh-game-copy">
            <div class="nh-game-index">02 // OPEN WORLD</div>
            <h3 class="nh-game-title"><span>ELDEN RING</span></h3>
            <div class="nh-game-meta">FROM SOFTWARE // BANDAI NAMCO // ACTION RPG</div>
            <button class="nh-game-expand" type="button">EXPAND DETAIL</button>
          </div>
        </div>
        <div class="nh-game-details">
          <div class="nh-game-details-grid">
            <div class="nh-game-detail-box"><span>STYLE</span><b>OPEN WORLD</b></div>
            <div class="nh-game-detail-box"><span>FOCUS</span><b>EXPLORATION / BUILDCRAFT</b></div>
            <div class="nh-game-detail-box"><span>PC PAGE</span><b>STEAM STORE</b></div>
          </div>
          <p>An open-world action RPG in the Lands Between, built around exploration, character builds, challenging encounters, and a large interconnected world.</p>
        </div>
      </article>

      <article class="nh-game-card" data-tags="all action" data-game="NieR:Automata" data-url="https://store.steampowered.com/app/524220/NieRAutomata/" aria-expanded="false">
        <div class="nh-game-body">
          <button class="nh-game-icon" type="button" aria-label="NieR Automata link options"><img loading="lazy" alt="NieR Automata game artwork" src="https://cdn.cloudflare.steamstatic.com/steam/apps/524220/header.jpg"/></button>
          <div class="nh-game-copy">
            <div class="nh-game-index">03 // ARCHIVE SIGNAL</div>
            <h3 class="nh-game-title"><span>NIER:AUTOMATA</span></h3>
            <div class="nh-game-meta">SQUARE ENIX // PLATINUMGAMES // ACTION RPG</div>
            <button class="nh-game-expand" type="button">EXPAND DETAIL</button>
          </div>
        </div>
        <div class="nh-game-details">
          <div class="nh-game-details-grid">
            <div class="nh-game-detail-box"><span>STYLE</span><b>ACTION RPG</b></div>
            <div class="nh-game-detail-box"><span>FOCUS</span><b>COMBAT / WORLD / STORY</b></div>
            <div class="nh-game-detail-box"><span>PC PAGE</span><b>STEAM STORE</b></div>
          </div>
          <p>An action RPG following androids 2B, 9S, and A2 in a machine-driven dystopian world, mixing fast combat, exploration, and a story-heavy campaign.</p>
        </div>
      </article>

      <article class="nh-game-card" data-tags="all action souls" data-game="Sekiro: Shadows Die Twice" data-url="https://store.steampowered.com/app/814380/SekiroShadows_Die_Twice__GOTY_Edition/" aria-expanded="false">
        <div class="nh-game-body">
          <button class="nh-game-icon" type="button" aria-label="Sekiro link options"><img loading="lazy" alt="Sekiro Shadows Die Twice game artwork" src="https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg"/></button>
          <div class="nh-game-copy">
            <div class="nh-game-index">04 // PRECISION</div>
            <h3 class="nh-game-title"><span>SEKIRO</span></h3>
            <div class="nh-game-meta">FROM SOFTWARE // ACTIVISION // ACTION-ADVENTURE</div>
            <button class="nh-game-expand" type="button">EXPAND DETAIL</button>
          </div>
        </div>
        <div class="nh-game-details">
          <div class="nh-game-details-grid">
            <div class="nh-game-detail-box"><span>STYLE</span><b>PRECISION ACTION</b></div>
            <div class="nh-game-detail-box"><span>FOCUS</span><b>PARRY / MOBILITY</b></div>
            <div class="nh-game-detail-box"><span>PC PAGE</span><b>STEAM STORE</b></div>
          </div>
          <p>A fast action-adventure built around precise swordplay, movement, stealth, and timing in a dark Sengoku-era setting.</p>
        </div>
      </article>

      <article class="nh-game-card" data-tags="all 2d action souls" data-game="Hollow Knight" data-url="https://store.steampowered.com/app/367520/Hollow_Knight/" aria-expanded="false">
        <div class="nh-game-body">
          <button class="nh-game-icon" type="button" aria-label="Hollow Knight link options"><img loading="lazy" alt="Hollow Knight game artwork" src="https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg"/></button>
          <div class="nh-game-copy">
            <div class="nh-game-index">05 // 2D WORLD</div>
            <h3 class="nh-game-title"><span>HOLLOW KNIGHT</span></h3>
            <div class="nh-game-meta">TEAM CHERRY // ACTION-ADVENTURE // 2D</div>
            <button class="nh-game-expand" type="button">EXPAND DETAIL</button>
          </div>
        </div>
        <div class="nh-game-details">
          <div class="nh-game-details-grid">
            <div class="nh-game-detail-box"><span>STYLE</span><b>2D METROIDVANIA</b></div>
            <div class="nh-game-detail-box"><span>FOCUS</span><b>EXPLORATION / ATMOSPHERE</b></div>
            <div class="nh-game-detail-box"><span>PC PAGE</span><b>STEAM STORE</b></div>
          </div>
          <p>A hand-drawn 2D action adventure set in a vast ruined kingdom, built around interconnected exploration, combat, secrets, and atmospheric world design.</p>
        </div>
      </article>

      <article class="nh-game-card" data-tags="all action" data-game="Devil May Cry 5" data-url="https://store.steampowered.com/app/601150/Devil_May_Cry_5/" aria-expanded="false">
        <div class="nh-game-body">
          <button class="nh-game-icon" type="button" aria-label="Devil May Cry 5 link options"><img loading="lazy" alt="Devil May Cry 5 game artwork" src="https://cdn.cloudflare.steamstatic.com/steam/apps/601150/header.jpg"/></button>
          <div class="nh-game-copy">
            <div class="nh-game-index">06 // STYLE SYSTEM</div>
            <h3 class="nh-game-title"><span>DEVIL MAY CRY 5</span></h3>
            <div class="nh-game-meta">CAPCOM // CHARACTER ACTION // COMBAT</div>
            <button class="nh-game-expand" type="button">EXPAND DETAIL</button>
          </div>
        </div>
        <div class="nh-game-details">
          <div class="nh-game-details-grid">
            <div class="nh-game-detail-box"><span>STYLE</span><b>CHARACTER ACTION</b></div>
            <div class="nh-game-detail-box"><span>FOCUS</span><b>COMBO / MOVEMENT</b></div>
            <div class="nh-game-detail-box"><span>PC PAGE</span><b>STEAM STORE</b></div>
          </div>
          <p>A character-action game focused on expressive combat, movement, spectacle, and chaining attacks across its campaign.</p>
        </div>
      </article>

      <article class="nh-game-card" data-tags="all action souls" data-game="DARK SOULS III" data-url="https://store.steampowered.com/app/374320/DARK_SOULS_III/" aria-expanded="false">
        <div class="nh-game-body">
          <button class="nh-game-icon" type="button" aria-label="Dark Souls III link options"><img loading="lazy" alt="Dark Souls III game artwork" src="https://cdn.cloudflare.steamstatic.com/steam/apps/374320/header.jpg"/></button>
          <div class="nh-game-copy">
            <div class="nh-game-index">07 // DARK ARCHIVE</div>
            <h3 class="nh-game-title"><span>DARK SOULS III</span></h3>
            <div class="nh-game-meta">FROM SOFTWARE // BANDAI NAMCO // ACTION RPG</div>
            <button class="nh-game-expand" type="button">EXPAND DETAIL</button>
          </div>
        </div>
        <div class="nh-game-details">
          <div class="nh-game-details-grid">
            <div class="nh-game-detail-box"><span>STYLE</span><b>DARK FANTASY</b></div>
            <div class="nh-game-detail-box"><span>FOCUS</span><b>EXPLORATION / COMBAT</b></div>
            <div class="nh-game-detail-box"><span>PC PAGE</span><b>STEAM STORE</b></div>
          </div>
          <p>A dark-fantasy action RPG from FromSoftware, with layered areas, deliberate combat, character builds, and a lore-heavy world.</p>
        </div>
      </article>
    </div>

    <div class="nh-gaming-footer">
      <span>HOVER // EXPAND // INSPECT // EXTERNAL LINK</span>
      <strong>08 // ARCHIVE ONLINE</strong>
    </div>
  </div>

  <div class="nh-game-link-popover" id="nhGameLinkPopover" aria-hidden="true">
    <div class="nh-game-link-panel" role="dialog" aria-modal="true" aria-label="Game link options">
      <button class="nh-game-link-close" type="button" aria-label="Close link options">×</button>
      <div class="nh-game-link-kicker">EXTERNAL LINK // GAME PAGE</div>
      <div class="nh-game-link-title">GAME</div>
      <p class="nh-game-link-url">store.steampowered.com/</p>
      <div class="nh-game-link-actions">
        <button class="nh-game-copy" type="button">COPY LINK</button>
        <button class="nh-game-open" type="button">OPEN GAME PAGE ↗</button>
      </div>
    </div>
  </div>
</section>
'''

# Keep the existing portfolio as the base and inject exactly one gaming section.
marker = '<section class="section links v150-links" id="links">'
if 'id="gaming-history"' not in html:
    pos = html.find(marker)
    if pos < 0:
        raise RuntimeError("Section 8 marker not found.")
    html = html[:pos] + section + '\n' + html[pos:]

# Renumber the existing network section from 08 to 09 so the new archive is Section 8.
links_pos = html.find(marker)
if links_pos >= 0:
    tail = html[links_pos:]
    tail = tail.replace('<span>08 // NETWORK</span>', '<span>09 // NETWORK</span>', 1)
    tail = tail.replace('ARCHIVE // 08 // ENDPOINT', 'ARCHIVE // 09 // ENDPOINT', 1)
    html = html[:links_pos] + tail

# Ensure asset references exist only once.
html = re.sub(r'<link\\b[^>]*href=["\\\']v21-gaming\\.css["\\\'][^>]*>\\s*', '', html, flags=re.I)
html = re.sub(r'<script\\b[^>]*src=["\\\']v21-gaming\\.js["\\\'][^>]*>\\s*</script>\\s*', '', html, flags=re.I)

head_end = html.lower().rfind('</head>')
if head_end < 0:
    raise RuntimeError("Missing </head>.")
html = html[:head_end] + CSS + '\n' + html[head_end:]

# Recompute after the <head> insertion because all later indices shift.
body_end = html.lower().rfind('</body>')
if body_end < 0:
    raise RuntimeError("Missing </body>.")
html = html[:body_end] + JS + '\n' + html[body_end:]

index.write_text(html, encoding="utf-8")
print("V21.0 gaming history section injected before Section 9.")
