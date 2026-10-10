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

# Exact roster and tier order from the user's reference screenshot.
# Names not shown in that screenshot are deliberately removed from every tier.
visible_tiers = {
    "One Above All": ["Tornado"],
    "GOAT": ["Sketch", "Fanta", "Smg", "Preqnox", "Vano"],
    "Z": ["Prayer", "Elfish", "Sinnkow", "Jameslol7", "Zitler", "Flare", "Kono", "MasterKlinge", "sigmaoriol", "Digger"],
    "SSS": ["Raze", "M4k", "Cxstom", "Cgg", "Fleemo", "Zenwydd", "Slater", "Saer", "Mickey", "Wex", "Seikiro", "Chickward", "Vxoow", "Sanyapep", "Doggone"],
    "SS": [
        "RANDOMYBA", "Duckmaster", "Xdusts", "Heary", "Mukankie", "Frozen", "dintion_j",
        "Kiril", "KiraniPro", "00Inx", "Sima", "Vendeur", "Q20ez", "Xezzir", "Blindwawa",
        "Yesmyst", "Gator", "Cam", "Workman", "Klet", "Arca / RetroAlex", "Garlic",
        "Lcanrblx", "Sympaths", "Elkhan", "MaliciousLobster", "Ryuma", "Kevin", "Faruk",
        "Sky", "Sacar", "Wyturz", "Raiden", "Arkanior"
    ],
    "S+": [
        "Ceresriot", "Zie", "=", "Alexandros", "Cd", "Emir", "Oj", "Eweoh", "Summerhater",
        "Shavrain", "spiritcourser", "Areeb", "Viper", "Sir_Diesalot", "Mureli", "Josh", "Stan",
        "=", "Uglymoon", "Zwqn", "mascarasleev", "Zero", "Hinjaku", "Meepo", "Termidog",
        "Hoshie", "Andrija", "Zarth1", "Lowzz", "sanches_plygg", "Azerty", "Puerta",
        "Zuchengs", "Chalk", "Clift", "Kuzym5", "Miraz", "Queks", "Bigdmariop", "Canner",
        "Nord", "Mathzz", "Igor", "Phenomenon", "MasterHalo666"
    ],
    "S": [
        "Greyandromeda", "Oxz", "Asassin", "Irinel", "Grx", "Bulagra", "Darin",
        "HaroldTheGoose", "77BountyHunter77", "Siebrink", "Zeet", "Brazagi", "Adwait",
        "Nebel", "Staine", "Camper", "Envy", "YutoSenpai", "Crwmn", "Kopek", "resent",
        "W0rldmach1ne", "Cmg", "Imraanis", "Crashjps", "James", "Ponosebebras", "Amedeo",
        "Instant", "rhysmlg", "Keplersync", "Bellasync", "Fool", "Loshad", "Cookie", "Autty",
        "Godzzplayzz", "YousayNu", "kuin", "Aprilsheep", "Zlatov", "Corza", "Jt", "s7lents",
        "Nova", "Vovaogg", "Memo", "Auxsty", "Down", "Sloth", "Yozzly", "Bbay eren1544"
    ],
}

# Keep the site's existing tier keys, but clear every tier not represented in
# the reference screenshot so no unlisted names survive elsewhere on the site.
data = {tier: visible_tiers.get(tier, []) for tier in data.keys()}

# Hard-remove the requested names from all tier data, regardless of capitalization.
for tier, players in data.items():
    data[tier] = [
        player for player in players
        if player.strip().casefold() not in {"necrotichollow", "aqualicz"}
    ]

replacement = match.group(1) + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + match.group(3)
html = html[:match.start()] + replacement + html[match.end():]

# Remove the previous broad text observer: it could also remove the creator
# credit. The tier data above is the source of truth for player chips.
guard_marker = '<script id="nh-remove-user-from-yba-tierlist">'
if guard_marker in html:
    guard_start = html.index(guard_marker)
    guard_end = html.index("</script>", guard_start) + len("</script>")
    html = html[:guard_start] + html[guard_end:]

# Add NecroticHollow to the TL CREATOR panel, not to any tier.
if "TL CREATOR" in html:
    if not re.search(r"TL CREATOR.{0,500}NecroticHollow", html, re.DOTALL | re.IGNORECASE):
        # Put the name directly after the creator heading's containing element.
        heading = re.search(r"(<[^>]*>\\s*TL CREATOR\\s*</[^>]+>)", html, re.IGNORECASE)
        if heading:
            credit = '<div class="nh-yba-tl-creator-name">NecroticHollow</div>'
            html = html[:heading.end()] + credit + html[heading.end():]
        else:
            raise SystemExit("Found TL CREATOR text but could not locate its HTML element.")
    if "nh-yba-tl-creator-style" not in html:
        style = """<style id="nh-yba-tl-creator-style">
.nh-yba-tl-creator-name{margin-top:7px;color:#f1d9ff;font:700 12px/1.4 Inter,Arial,sans-serif;letter-spacing:.04em;text-shadow:0 0 10px rgba(210,105,255,.35)}
</style>
"""
        head = html.lower().rfind("</head>")
        if head >= 0:
            html = html[:head] + style + html[head:]
        else:
            html = style + html
else:
    raise SystemExit("Could not find TL CREATOR heading in generated index.html.")

path.write_text(html, encoding="utf-8")
print("YBA tier list synchronized; NecroticHollow appears in TL CREATOR only, not in any tier.")
