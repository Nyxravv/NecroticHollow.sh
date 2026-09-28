from pathlib import Path

index = Path("index.html")
text = index.read_text(encoding="utf-8")

css_link = '<link rel="stylesheet" href="v20-music.css">'
js_script = '<script src="v20-music.js"></script>'

music_html = r'''
<!-- V20.0 REMAKE — front-page compact music player -->
<div class="nh-music-dock tilt" id="nhMusicDock">
  <button aria-label="Play or pause music" class="nh-music-play" id="nhMusicPlay" type="button">▶</button>
  <div class="nh-music-meta">
    <span class="nh-music-kicker">MUSIC // ACTIVE QUEUE</span>
    <strong class="nh-music-title" id="nhMusicTitle">Party Addict — kets4eki, Nosgov, kojo</strong>
    <span class="nh-music-status" id="nhMusicStatus">SOURCE REQUIRED // ADD AUDIO FILE</span>
  </div>
  <div class="nh-music-tools">
    <input aria-label="Music volume" class="nh-music-volume" id="nhMusicVolume" max="1" min="0" step="0.01" type="range" value=".65"/>
    <button class="nh-music-list" id="nhMusicOpen" type="button">PLAYLIST ↗</button>
  </div>
  <audio class="nh-music-file" id="nhMusicAudio" preload="none"></audio>
</div>

<!-- V20.0 REMAKE — cinematic music viewer -->
<div aria-hidden="true" class="nh-music-modal" id="nhMusicModal">
  <div aria-labelledby="nhMusicModalTitle" aria-modal="true" class="nh-music-panel" role="dialog">
    <div class="nh-music-head">
      <div class="nh-music-label">MUSIC // PERSONAL QUEUE</div>
      <h2 id="nhMusicModalTitle">NECROTIC<span style="color:#ff3158">HOLLOW</span> // PLAYLIST</h2>
      <p>CLICK A TRACK TO LOAD IT · VOLUME CONTROL REMAINS ACTIVE BELOW · TIME // ERASE VISUAL ONLINE</p>
      <button aria-label="Close music playlist" class="nh-music-close" id="nhMusicClose" type="button">×</button>
    </div>
    <div class="nh-music-listbox" id="nhMusicListBox"></div>
    <div class="nh-music-bottom">
      <span>V20.0 REMAKE // AUDIO PLAYER</span>
      <span><strong id="nhMusicBottomState">READY</strong> · ESC // CLOSE</span>
    </div>
  </div>
</div>
'''

if 'id="nhMusicDock"' not in text:
    anchor = '<div class="hero-corner">'
    if anchor not in text:
        raise SystemExit("Hero anchor not found.")
    text = text.replace(anchor, music_html + '\n' + anchor, 1)

if css_link not in text:
    head = text.lower().rfind("</head>")
    text = text[:head] + "\n" + css_link + "\n" + text[head:]

if js_script not in text:
    body = text.lower().rfind("</body>")
    text = text[:body] + "\n" + js_script + "\n" + text[body:]

index.write_text(text, encoding="utf-8")
print("V20 music layer injected.")
