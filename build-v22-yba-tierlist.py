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

def set_visible_order(tier, names):
    # Move these players into the shown tier and place them in the exact
    # left-to-right order from the supplied reference; preserve other entries.
    for name in names:
        remove_player(name)
    remaining = data.get(tier, [])
    data[tier] = names + remaining

# Previous requested placements.
for player in ("Zero", "Sir_Diesalot", "Faruk"):
    remove_player(player)
set_visible_order("S+", ["Viper", "Sir_Diesalot", "Mureli", "Josh", "Stan", "=", "Uglymoon", "Zwqn", "mascarasleev", "Zero"])

# Match the newly supplied tier-list reference. Names shown are ordered exactly
# as in the screenshot; additional players not visible in its crop are retained.
set_visible_order("One Above All", ["Tornado"])
set_visible_order("GOAT", ["Sketch", "Fanta", "Smg", "Preqnox", "Vano"])
set_visible_order("Z", ["Prayer", "Elfish", "Sinnkow", "Jameslol7", "Zitler", "Flare", "Kono", "MasterKlinge", "sigmaoriol", "Digger"])
set_visible_order("SSS", ["Raze", "M4k", "Cxstom", "Cgg", "Fleemo", "Zenwydd", "Slater", "Saer", "Mickey", "Wex", "Seikiro", "Chickward", "Vxoow", "Sanyapep", "Doggone"])
set_visible_order("SS", ["RANDOMYBA", "Duckmaster", "Xdusts", "Heary", "Mukankie", "Frozen", "dintion_j", "Kiril", "KiraniPro", "00Inx", "Sima", "Vendeur", "Q20ez", "Xezzir", "Blindwawa", "Yesmyst", "Gator", "Cam", "Workman", "Klet", "Arca / RetroAlex", "Garlic", "Lcanrblx", "Sympaths"])

# Ensure Faruk is in SS at the requested exact visible placement.
remove_player("Faruk")
if "Kevin" in data["SS"]:
    data["SS"].insert(data["SS"].index("Kevin") + 1, "Faruk")
else:
    data["SS"].append("Faruk")

# These players must not appear in the Z tier; preserve them elsewhere if present.
excluded_from_z = {"NECROTICHOLLOW", "Aqualicz"}
data["Z"] = [player for player in data.get("Z", []) if player not in excluded_from_z]

replacement = match.group(1) + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + match.group(3)
html = html[:match.start()] + replacement + html[match.end():]
path.write_text(html, encoding="utf-8")
print("YBA tier list synchronized; NECROTICHOLLOW and Aqualicz removed from Z.")
