from pathlib import Path
import re

INDEX = Path("index.html")
text = INDEX.read_text(encoding="utf-8")

def remove_between(source, start_marker, end_marker):
    start = source.find(start_marker)
    if start == -1:
        return source
    end = source.find(end_marker, start + len(start_marker))
    if end == -1:
        return source
    return source[:start] + source[end:]

def remove_css_rule(source, selector):
    pos = source.find(selector)
    if pos == -1:
        return source
    brace = source.find("{", pos + len(selector))
    if brace == -1:
        return source

    depth = 0
    for i in range(brace, len(source)):
        if source[i] == "{":
            depth += 1
        elif source[i] == "}":
            depth -= 1
            if depth == 0:
                return source[:pos] + source[i + 1:]
    return source

# Remove HTML sparkle overlay elements.
text = re.sub(
    r'<span[^>]*class=["\']sparkle-field["\'][^>]*></span>',
    "",
    text,
    flags=re.I
)

# Remove V14 gameplay/CTA sparkle generator.
text = remove_between(
    text,
    "/* V14.0 — local cursor tracking + tiny sparkle bursts for playlist cards and portfolio CTA. */",
    "/* V14.5 — ABOUT interaction:"
)

# Remove Tornado modal particle emitter and call.
text = text.replace("  if(tornado || owner) spawnTornadoSparks();\n", "")
text = remove_between(text, "function spawnTornadoSparks(){", "function closePlayer(){")

# Remove tier particle generator and the pointermove emitter that calls it.
text = remove_between(
    text,
    "function spawnTierSpark(x,y,color){",
    "ybaFullShell?.addEventListener('pointermove',(e)=>{"
)
text = remove_between(
    text,
    "let lastTierSpark=0;",
    "/* Pointer feedback on every username:"
)

# Remove all known particle CSS rules/keyframes only.
for selector in (
    ".v14-spark",
    "@keyframes v14Spark",
    ".tier-spark",
    "@keyframes tierSpark",
    ".tornado-spark",
    "@keyframes tornadoSpark",
    ".game-card .sparkle-field",
    ".game-card:hover .sparkle-field",
    ".game-card .sparkle-field:before,.game-card .sparkle-field:after",
    ".game-card .sparkle-field:before",
    ".game-card .sparkle-field:after",
):
    while selector in text:
        text = remove_css_rule(text, selector)

# Remove the V14.1 CTA-only sparkle override comment/rule if present.
text = remove_between(
    text,
    "/* V14.1 — make cursor glitter clearly visible on the CTA only. */",
    "/* V14.5 — premium interactive ABOUT / PROFILE archive */"
)

# This cleanup must never modify CounterAPI: it does not search, replace,
# or reconstruct any CounterAPI code.
for forbidden in (
    "v14-spark", "v14Spark", "sparkleBurst",
    "tornado-spark", "tornadoSpark", "spawnTornadoSparks",
    "tier-spark", "tierSpark", "spawnTierSpark",
    "sparkle-field"
):
    if forbidden in text:
        raise RuntimeError("Particle code remains: " + forbidden)

INDEX.write_text(text, encoding="utf-8")
print("Clean V19.5 build generated.")
