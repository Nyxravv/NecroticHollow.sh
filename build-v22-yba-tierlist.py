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
if "Faruk" not in data.get("S", []):
    raise SystemExit("Faruk was not found in S; refusing to make an uncertain edit")
if "Zero" in sum(data.values(), []) or "Sir_Diesalot" in sum(data.values(), []):
    raise SystemExit("One or more requested names already exist; refusing duplicate insertion")

data["S"].remove("Faruk")
data["SS"].append("Faruk")
data["S+"].extend(["Zero", "Sir_Diesalot"])
replacement = match.group(1) + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + match.group(3)
html = html[:match.start()] + replacement + html[match.end():]
path.write_text(html, encoding="utf-8")
print("YBA tierlist updated: Zero and Sir_Diesalot added to S+; Faruk moved to SS.")
