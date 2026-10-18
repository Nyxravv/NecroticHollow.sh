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
    const labels = [...document.querySelectorAll("th, td, div, span, label, strong, p, h1, h2, h3")]
      .filter(el => el.children.length === 0 && (el.textContent || "").replace(/\s+/g, " ").trim().toLowerCase() === "tl creator");
    for (const label of labels) {
      const parent = label.parentElement;
      if (!parent || parent.querySelector(".nh-yba-owner-card")) continue;
      const card = document.createElement("button");
      card.type = "button";
      card.className = "nh-yba-owner-card";
      card.setAttribute("aria-haspopup", "dialog");
      card.setAttribute("aria-label", "Open NecroticHollow profile");
      card.innerHTML = '<span class="nh-yba-owner-mark">NH</span><span class="nh-yba-owner-copy"><strong>NecroticHollow</strong><small>OWNER // RECOGNISED COMPETITOR</small></span><span class="nh-yba-owner-open">VIEW PROFILE ↗</span>';
      card.style.cssText = "display:flex;align-items:center;gap:11px;width:fit-content;max-width:100%;margin:10px 0 0;padding:10px 13px;text-align:left;cursor:pointer;border:1px solid rgba(205,113,255,.46);border-radius:7px;background:linear-gradient(115deg,rgba(87,29,111,.42),rgba(22,17,34,.88));color:#f8edff;font:inherit;box-shadow:inset 0 1px rgba(255,255,255,.035);transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease,background .22s ease";
      if (!document.getElementById("nh-yba-owner-profile-style")) {
        const style = document.createElement("style");
        style.id = "nh-yba-owner-profile-style";
        style.textContent = ".nh-yba-owner-card:hover,.nh-yba-owner-card:focus-visible{transform:translateY(-2px);border-color:#e7a0ff!important;background:linear-gradient(115deg,rgba(126,44,157,.58),rgba(34,19,48,.96))!important;box-shadow:0 0 0 1px rgba(205,113,255,.18),0 0 22px rgba(197,78,255,.2),0 8px 24px rgba(0,0,0,.22)!important;outline:none}.nh-yba-owner-mark{display:grid;place-items:center;flex:0 0 35px;height:35px;border:1px solid rgba(225,166,255,.65);border-radius:5px;background:linear-gradient(145deg,#54216c,#24152f);color:#f5d9ff;font-weight:800;font-size:12px;letter-spacing:.05em;text-shadow:0 0 10px #c56bff}.nh-yba-owner-copy{display:flex;flex-direction:column;gap:3px;min-width:0}.nh-yba-owner-copy strong{font-size:13px;line-height:1.2;color:#fff}.nh-yba-owner-copy small{font-size:9px;line-height:1.25;letter-spacing:.13em;color:#cba7df}.nh-yba-owner-open{margin-left:8px;font-size:9px;letter-spacing:.09em;color:#dca5ff;white-space:nowrap}.nh-yba-profile-backdrop{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:20px;background:rgba(7,5,12,.78);backdrop-filter:blur(9px);opacity:0;transition:opacity .2s ease}.nh-yba-profile-backdrop.nh-open{opacity:1}.nh-yba-profile-card{position:relative;overflow-y:auto;width:min(650px,100%);max-height:min(84vh,850px);border:1px solid rgba(211,132,255,.55);border-radius:13px;background:linear-gradient(155deg,#1b1425,#100e18 60%,#1d1028);color:#f4edf9;box-shadow:0 25px 90px rgba(0,0,0,.55),0 0 45px rgba(151,59,208,.16);transform:translateY(10px) scale(.985);transition:transform .2s ease}.nh-open .nh-yba-profile-card{transform:translateY(0) scale(1)}.nh-yba-profile-top{position:relative;padding:25px 27px 22px;background:radial-gradient(ellipse at 85% 0%,rgba(185,70,255,.22),transparent 48%);border-bottom:1px solid rgba(210,136,255,.2)}.nh-yba-profile-kicker{font-size:10px;letter-spacing:.2em;color:#d3a5f1}.nh-yba-profile-name{margin:9px 40px 5px 0;font-size:clamp(25px,5vw,37px);font-weight:800;color:#fff;text-shadow:0 0 22px rgba(195,94,255,.22)}.nh-yba-profile-sub{font-size:11px;letter-spacing:.12em;color:#d4b3e8}.nh-yba-profile-badges{display:flex;flex-wrap:wrap;gap:7px;margin-top:17px}.nh-yba-profile-badges span{padding:6px 9px;border:1px solid rgba(210,136,255,.28);border-radius:4px;background:rgba(125,55,156,.14);font-size:10px;color:#f0d9ff}.nh-yba-profile-close{position:absolute;top:15px;right:16px;width:34px;height:34px;border:1px solid rgba(220,164,255,.35);border-radius:6px;background:rgba(255,255,255,.035);color:#f8eaff;font-size:22px;cursor:pointer}.nh-yba-profile-body{padding:23px 27px 27px}.nh-yba-profile-body h4{margin:18px 0 7px;font-size:10px;letter-spacing:.17em;color:#d9a8f5}.nh-yba-profile-body p{margin:0;color:#d7cbdc;font-size:13px;line-height:1.8}.nh-yba-profile-footer{padding:13px 27px;border-top:1px solid rgba(210,136,255,.17);font-size:9px;letter-spacing:.14em;color:#a88ab8}@media(max-width:520px){.nh-yba-owner-open{display:none}.nh-yba-profile-top,.nh-yba-profile-body{padding-left:18px;padding-right:18px}}";
        document.head.appendChild(style);
      }
      card.addEventListener("click", () => {
        if (document.querySelector(".nh-yba-profile-backdrop")) return;
        const backdrop = document.createElement("div");
        backdrop.className = "nh-yba-profile-backdrop";
        backdrop.innerHTML = '<article class="nh-yba-profile-card" role="dialog" aria-modal="true" aria-labelledby="nhYbaProfileName"><header class="nh-yba-profile-top"><button class="nh-yba-profile-close" type="button" aria-label="Close profile">×</button><div class="nh-yba-profile-kicker">TL CREATOR // OWNER PROFILE</div><h2 class="nh-yba-profile-name" id="nhYbaProfileName">NecroticHollow</h2><div class="nh-yba-profile-sub">TIER LIST OWNER · YBA PLAYER</div><div class="nh-yba-profile-badges"><span>OWNER</span><span>COMPETITIVE PLAYER</span><span>COMMUNITY PROFILE</span></div></header><div class="nh-yba-profile-body"><h4>ABOUT THE OWNER</h4><p>NecroticHollow is the owner behind this tier-list project, responsible for maintaining its presentation, organising player placements, and keeping the roster aligned with the current reference. The creator role reflects the time invested in shaping the list, tracking changes, and presenting player rankings in a clear and consistent format.</p><h4>COMPETITIVE REPUTATION</h4><p>NecroticHollow is presented here as a highly capable player with a strong competitive identity. This profile highlights matchup awareness, adaptation, confident decision-making, and the ability to compete against experienced opponents. Strong play is about more than one result: it involves learning opponents, making decisions under pressure, refining execution, and continuing to improve.</p><h4>PLAYSTYLE &amp; APPROACH</h4><p>The profile emphasises preparation, consistency, game knowledge, and the willingness to review mistakes instead of repeating them. Competitive play rewards patience as much as aggression: recognising patterns, understanding spacing and timing, choosing the right response, and adapting when an opponent changes their approach. These qualities form the basis of the strong-player reputation represented by this card.</p><h4>ROLE IN THE TIER LIST</h4><p>As owner, NecroticHollow oversees the tier list’s structure and presentation while keeping the creator credit separate from ranked player entries. The owner name belongs in the TL Creator panel—not as an extra chip in Z, SSS, SS, S+, S, or any other player tier. This profile is separate from the competitive ranking itself.</p><h4>PROFILE NOTE</h4><p>This is a creator-written profile, not an independently verified tournament record. Its purpose is to introduce the owner, communicate a strong competitive identity, and give visitors a polished profile view consistent with the tier list’s visual style.</p></div><footer class="nh-yba-profile-footer">NECROTICHOLLOW // TL CREATOR PROFILE</footer></article>';
        document.body.appendChild(backdrop);
        const close = () => { backdrop.classList.remove("nh-open"); document.removeEventListener("keydown", onKey); setTimeout(() => backdrop.remove(), 220); };
        const onKey = e => { if (e.key === "Escape") close(); };
        backdrop.addEventListener("click", e => { if (e.target === backdrop) close(); });
        backdrop.querySelector(".nh-yba-profile-close").addEventListener("click", close);
        document.addEventListener("keydown", onKey);
        requestAnimationFrame(() => backdrop.classList.add("nh-open"));
      });
      label.insertAdjacentElement("afterend", card);
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
