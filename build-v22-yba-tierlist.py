from pathlib import Path
import json
import re

path = Path("index.html")
html = path.read_text(encoding="utf-8")
pattern = re.compile(r"(const ybaTierData = )(\{.*?\})(;)", re.DOTALL)
match = pattern.search(html)
if not match:
    raise SystemExit("Could not find ybaTierData in index.html")

data = json.loads(match.group(2))

def remove_player(name):
    for players in data.values():
        while name in players:
            players.remove(name)

def insert_after(tier, anchor, name):
    players = data.get(tier, [])
    if anchor not in players:
        raise SystemExit(f"Expected placement anchor {anchor!r} missing from {tier}")
    players.insert(players.index(anchor) + 1, name)

# Reposition the requested names deterministically on every build.
for player in ("Zero", "Sir_Diesalot", "Faruk"):
    remove_player(player)

insert_after("S+", "Viper", "Sir_Diesalot")
insert_after("S+", "mascarasleev", "Zero")
insert_after("SS", "Kevin", "Faruk")

replacement = match.group(1) + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + match.group(3)
html = html[:match.start()] + replacement + html[match.end():]
path.write_text(html, encoding="utf-8")
print("YBA tierlist placements set: Sir_Diesalot after Viper; Zero after mascarasleev; Faruk after Kevin.")
