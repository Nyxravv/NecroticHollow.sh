from pathlib import Path

index = Path("index.html")
text = index.read_text(encoding="utf-8")

# CounterAPI is deliberately not read, replaced, or rewritten by this cleanup.
# This build step only removes the known particle/spark classes and emitters.

lines = text.splitlines()

def remove_between(start_marker, end_marker):
    global lines
    starts = [i for i, line in enumerate(lines) if start_marker in line]
    if not starts:
        return
    start = starts[0]
    ends = [i for i, line in enumerate(lines[start + 1:], start + 1) if end_marker in line]
    if not ends:
        return
    del lines[start:ends[0]]

# Remove V14 sparkle-particle generator block.
remove_between(
    "/* V14.0 — local cursor tracking + tiny sparkle bursts for playlist cards and portfolio CTA. */",
    "/* V14.5 — ABOUT interaction:"
)

# Remove the Tornado/owner modal particle spawn and generator.
lines = [line for line in lines if "if(tornado || owner) spawnTornadoSparks();" not in line]
for i, line in enumerate(lines):
    if line.startswith("function spawnTornadoSparks(){"):
        j = i + 1
        while j < len(lines) and lines[j].strip() != "}":
            j += 1
        del lines[i:j + 1]
        break

# Remove tier-list sparkle particle generator.
starts = [i for i, line in enumerate(lines) if line.startswith("function spawnTierSpark(x,y,color){")]
if starts:
    start = starts[0]
    ends = [i for i, line in enumerate(lines[start:], start) if line.startswith("/* Pointer feedback on every username:")]
    if ends:
        del lines[start:ends[0]]

# Remove particle CSS rules and the old CTA particle override.
clean = []
skip_cta = False
for line in lines:
    if line.strip() == "/* V14.1 — make cursor glitter clearly visible on the CTA only. */":
        skip_cta = True
        continue
    if skip_cta:
        if line.strip() == "}":
            skip_cta = False
        continue
    if any(token in line for token in (
        ".v14-spark", "@keyframes v14Spark",
        ".tier-spark", "@keyframes tierSpark",
        ".tornado-spark", "@keyframes tornadoSpark",
        ".sparkle-field",
    )):
        continue
    clean.append(line)

text = "\n".join(clean) + "\n"
text = text.replace('<span aria-hidden="true" class="sparkle-field"></span>', "")
text = text.replace('<span class="sparkle-field"></span>', "")

for forbidden in (
    "v14-spark", "v14Spark", "sparkleBurst",
    "tornado-spark", "tornadoSpark", "spawnTornadoSparks",
    "tier-spark", "tierSpark", "spawnTierSpark", "sparkle-field"
):
    assert forbidden not in text, f"Particle code still present: {forbidden}"

index.write_text(text, encoding="utf-8")

# This is a build-only cleanup file; do not publish it as part of the site.
try:
    Path(__file__).unlink()
except OSError:
    pass

print("V19.5 particle cleanup complete; CounterAPI preserved.")
