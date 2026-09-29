from pathlib import Path
import re

index = Path("index.html")
html = index.read_text(encoding="utf-8")

CSS_LINK = '<link rel="stylesheet" href="v20-music.css">'
JS_SCRIPT = '<script src="v20-music.js"></script>'

# Remove any previous V20 music markup by its unique root IDs.
def remove_div_by_id(source, element_id):
    marker = f'id="{element_id}"'
    pos = source.find(marker)
    if pos < 0:
        return source

    start = source.rfind("<div", 0, pos)
    if start < 0:
        return source

    token_re = re.compile(r"</?div\b[^>]*>", re.I)
    depth = 0
    end = None

    for m in token_re.finditer(source, start):
        token = m.group(0)
        if token.lower().startswith("</div"):
            depth -= 1
            if depth == 0:
                end = m.end()
                break
        else:
            depth += 1

    if end is None:
        raise RuntimeError(f"Could not safely remove #{element_id}")

    return source[:start] + source[end:]

html = remove_div_by_id(html, "nhMusicDock")
html = remove_div_by_id(html, "nhMusicModal")

# Remove any stale direct asset references so each deployment has exactly one.
html = re.sub(r'<link\b[^>]*href=["\']v20-music\.css["\'][^>]*>\s*', '', html, flags=re.I)
html = re.sub(r'<script\b[^>]*src=["\']v20-music\.js["\'][^>]*>\s*</script>\s*', '', html, flags=re.I)

music_html = r'''
<div class="nh-music-dock" id="nhMusicDock">
  <div class="nh-music-spark-field" aria-hidden="true">
    <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
  </div>
  <button aria-label="Play or pause music" class="nh-music-play" id="nhMusicPlay" type="button">▶</button>
  <div class="nh-music-meta">
    <span class="nh-music-kicker">MUSIC // ACTIVE QUEUE</span>
    <strong class="nh-music-title" id="nhMusicTitle">Party Addict — kets4eki, Nosgov, kojo</strong>
    <span class="nh-music-status" id="nhMusicStatus">READY // 08% START VOLUME</span>
  </div>
  <div class="nh-music-tools">
    <input aria-label="Music volume" class="nh-music-volume" id="nhMusicVolume" max="1" min="0" step="0.01" type="range" value="0.08">
    <button class="nh-music-list" id="nhMusicOpen" type="button">QUEUE ↗</button>
  </div>
  <div class="nh-next-track" id="nhMusicNext" aria-hidden="true"></div>
  <audio class="nh-music-file" id="nhMusicAudio" preload="metadata"></audio>
</div>
'''

# Put the player directly after the existing visitor-node inside top-right-stack.
needle = '</div>\n\n<div class="noise"></div>'
if music_html not in html:
    pattern = re.compile(r'(<div class="top-right-stack">.*?)(</div>\s*<div class="noise"></div>)', re.S)
    match = pattern.search(html)
    if not match:
        raise RuntimeError("Could not locate top-right-stack / visitor counter area.")
    html = html[:match.start(2)] + music_html + '\n' + html[match.start(2):]

# Add the asset references at the end of the document.
head_end = html.lower().rfind('</head>')
if head_end < 0:
    raise RuntimeError("Missing </head>")
html = html[:head_end] + CSS_LINK + '\n' + html[head_end:]

body_end = html.lower().rfind('</body>')
if body_end < 0:
    raise RuntimeError("Missing </body>")
html = html[:body_end] + JS_SCRIPT + '\n' + html[body_end:]

index.write_text(html, encoding="utf-8")
print("V20.5 clean music player injected directly under visitor counter.")
