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

replacement = match.group(1) + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + match.group(3)
html = html[:match.start()] + replacement + html[match.end():]
path.write_text(html, encoding="utf-8")
print("YBA tier list replaced with only the names shown in the reference screenshot.")
