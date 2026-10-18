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
    "Z": ["Prayer", "Elfish", "Sinnkow", "Zitler", "Jameslol7 (FLUCTUATING)", "Flare", "sigmaoriol", "Kono", "MasterKlinge"],
    "SSS": ["Digger", "Bogdan", "Raze", "M4k", "Cxstom", "Cgg", "Fleemo", "Vxoow", "Slater", "Zenwydd", "Saer", "Mickey", "Wex", "Seikiro", "=", "Ryuma", "=", "Cd"],
    "SS": [
        "Doggone", "Chickward", "Sanyapep", "MaliciousLobster", "RANDOMYBA", "Duckmaster", "Xdusts", "Mukankie", "Frozen",
        "Q20ez", "dintion_j", "Kiril", "00Inx", "Sima", "Eweoh", "Vendeur", "Xezzir", "Blindwawa", "KiraniPro", "Yesmyst",
        "Workman", "Klet", "Arca / RetroAlex", "Cam", "Faruk", "Lcanrblx", "Sympaths", "Garlic", "Sky", "Hinjaku", "Mureli",
        "Heary"
    ],
    "S+": [
        "Elkhan", "Wyturz", "Raiden", "Arkanior", "Ceresriot", "Zie", "=", "Alexandros", "Emir", "Oj", "Sacar", "Kevin",
        "Summerhater", "spiritcourser", "Viper", "Sir_Diesalot", "Gator", "Josh", "Stan", "Nord", "Uglymoon", "Zwqn",
        "mascarasleev", "Zero", "Meepo", "Termidog", "Hoshie", "Andrija", "Zarth1", "Areeb", "Phenomenon", "Lowzz",
        "Shayraim", "sanches_plygg", "Azerty", "Puerta", "Zuchengs", "Chalk", "Clift", "Kuzym5", "Miraz", "Queks",
        "Bigdmariop", "Canner"
    ],
    "S": [
        "Mathzz", "Igor", "MasterHalo666", "Greyandromeda", "Oxz", "Asassin", "Irinel", "Grx", "Bulagra", "Darin",
        "HaroldTheGoose", "77BountyHunter77", "Siebrink", "Zeet", "Brazagi", "Adwait", "Nebel", "Staine", "Camper", "Envy",
        "YutoSenpai", "Crwmn", "Kopek", "resent", "W0rldmach1ne", "Cmg", "Imraanis", "Crashjps", "James", "Ponosebebras",
        "Amedeo", "Instant", "rhysmlg", "Keplersync", "Bellasync", "Fool", "Loshad", "Cookie", "Autty", "Godzzplayzz",
        "YousayNu", "kuin", "Aprilsheep", "Zlatov", "Corza", "Jt", "s7lents", "Nova", "Vovaogg", "Memo", "Auxsty", "Down",
        "Sloth", "Yozzly", "Bbay eren1544"
    ],
}

# Update only tiers visible in the reference screenshot. Preserve any tiers
# outside the screenshot and their existing entries.
for tier, players in visible_tiers.items():
    if tier in data:
        data[tier] = players

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

# Add the creator credit at runtime because the TL Creator panel is rendered
# dynamically by the tier-list UI. This deliberately does not add a player chip.
creator_script = r"""
<script id="nh-yba-creator-credit">
(() => {
  const addCreatorCredit = () => {
    const labels = [...document.querySelectorAll("th, td, div, span, label, strong, p")]
      .filter(el => el.children.length === 0 && (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase() === "tl creator");
    for (const label of labels) {
      const row = label.closest("tr") || label.parentElement?.parentElement || label.parentElement;
      if (!row || row.querySelector(".nh-yba-tl-creator-name")) continue;
      const credit = document.createElement("div");
      credit.className = "nh-yba-tl-creator-name";
      credit.textContent = "Now current holder: NecroticHollow";
      credit.style.cssText = "display:inline-block;margin:7px 8px 0 0;padding:8px 12px;background:#f5f5f5;color:#111;font:400 14px/1.4 Inter,Arial,sans-serif";
      row.appendChild(credit);
    }
  };
  addCreatorCredit();
  new MutationObserver(addCreatorCredit).observe(document.documentElement, { childList: true, subtree: true });
})();
</script>
"""
creator_marker = '<script id="nh-yba-creator-credit">'
if creator_marker in html:
    cstart = html.index(creator_marker)
    cend = html.index("</script>", cstart) + len("</script>")
    html = html[:cstart] + html[cend:]
body_end = html.lower().rfind("</body>")
if body_end < 0:
    raise SystemExit("Missing </body> while adding creator credit.")
html = html[:body_end] + creator_script + "\n" + html[body_end:]

path.write_text(html, encoding="utf-8")
print("YBA tier list synchronized; NecroticHollow appears in TL CREATOR only, not in any tier.")
