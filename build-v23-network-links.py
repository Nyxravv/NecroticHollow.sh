from html.parser import HTMLParser
from pathlib import Path
import re

INDEX = Path("index.html")
LINK_URL = "https://goatd.fr/NecroticHollow"
LINK_TITLE = "GOATD"
LINK_DESCRIPTION = "An external profile for the wider network."
TARGET_TITLES = ("ROBLOX PROFILE", "GUNS.LOL", "NECROTICHOLLOW")

VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}

CARD_HTML = f'''\n        <a class="nh-v23-network-card" href="{LINK_URL}" target="_blank" rel="noopener noreferrer" aria-label="Open Goatd profile">\n          <span class="nh-v23-network-number">04</span>\n          <span class="nh-v23-network-icon" aria-hidden="true">↗</span>\n          <span class="nh-v23-network-copy">\n            <span class="nh-v23-network-kicker">IDENTITY // EXTERNAL</span>\n            <span class="nh-v23-network-title">{LINK_TITLE}</span>\n            <span class="nh-v23-network-description">{LINK_DESCRIPTION}</span>\n          </span>\n          <span class="nh-v23-network-arrow" aria-hidden="true">↗</span>\n        </a>\n'''

CSS = r'''<style id="nh-v23-network-links-css">
#links a.nh-v23-network-card {
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 26px 34px minmax(0, 1fr);
  align-items: start;
  gap: 0 14px;
  width: 100%;
  min-width: 0;
  min-height: 190px;
  padding: 22px 20px;
  overflow: hidden;
  color: #f7efff;
  text-align: left;
  text-decoration: none;
  border: 1px solid rgba(193, 76, 255, .82);
  background:
    radial-gradient(ellipse at 20% 0%, rgba(145, 38, 190, .19), transparent 68%),
    linear-gradient(145deg, rgba(25, 8, 34, .96), rgba(9, 5, 15, .98));
  transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;
}
#links a.nh-v23-network-card::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(115deg, transparent 15%, rgba(180, 73, 255, .08), transparent 72%);
  opacity: .7;
}
#links a.nh-v23-network-card:hover,
#links a.nh-v23-network-card:focus-visible {
  border-color: rgba(255, 49, 105, .96);
  box-shadow: 0 0 0 1px rgba(255, 49, 105, .28), 0 0 24px rgba(183, 44, 255, .15);
  transform: translateY(-2px);
  outline: none;
}
#links .nh-v23-network-number {
  position: relative;
  z-index: 1;
  padding-top: 3px;
  color: #ff416f;
  font: 700 7px/1.4 "JetBrains Mono", monospace;
  letter-spacing: .08em;
}
#links .nh-v23-network-icon {
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  box-sizing: border-box;
  color: #efbaff;
  font: 13px/1 Inter, sans-serif;
  border: 1px solid rgba(192, 94, 255, .72);
  background: rgba(20, 7, 30, .65);
}
#links .nh-v23-network-copy {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  padding: 0 10px 0 0;
}
#links .nh-v23-network-kicker {
  display: block;
  margin: 0 0 7px;
  color: #a99bb2;
  font: 500 7px/1.4 "JetBrains Mono", monospace;
  letter-spacing: .12em;
  text-transform: uppercase;
}
#links .nh-v23-network-title {
  display: block;
  margin: 0 0 10px;
  color: #fff8ff;
  font: 900 italic 22px/.98 Inter, sans-serif;
  letter-spacing: -.045em;
  overflow-wrap: anywhere;
}
#links .nh-v23-network-description {
  display: block;
  max-width: 280px;
  color: #a79bab;
  font: 9px/1.65 "JetBrains Mono", monospace;
}
#links .nh-v23-network-arrow {
  position: absolute;
  top: 24px;
  right: 22px;
  z-index: 2;
  color: #ff416f;
  font: 700 16px/1 Inter, sans-serif;
}
@media (max-width: 700px) {
  #links a.nh-v23-network-card { min-height: 164px; padding: 18px 14px; grid-template-columns: 20px 32px minmax(0, 1fr); gap: 0 10px; }
  #links .nh-v23-network-icon { width: 32px; height: 32px; }
  #links .nh-v23-network-title { font-size: 19px; }
  #links .nh-v23-network-arrow { top: 19px; right: 14px; }
}
@media (prefers-reduced-motion: reduce) {
  #links a.nh-v23-network-card { transition: none; }
  #links a.nh-v23-network-card:hover { transform: none; }
}
</style>'''


class _SectionFound(Exception):
    pass


class SectionEndFinder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.started = False
        self.depth = 0
        self.end_offset = None
        self._line_starts = [0]
        self._source = ""

    def feed_source(self, source):
        self._source = source
        self._line_starts = [0]
        self._line_starts.extend(i + 1 for i, ch in enumerate(source) if ch == "\n")
        try:
            self.feed(source)
        except _SectionFound:
            pass
        return self.end_offset

    def _offset(self):
        line, col = self.getpos()
        return self._line_starts[line - 1] + col

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if not self.started:
            if tag == "section" and attrs.get("id") == "links":
                self.started = True
                self.depth = 1
        elif tag == "section":
            self.depth += 1

    def handle_endtag(self, tag):
        if self.started and tag == "section":
            self.depth -= 1
            if self.depth == 0:
                end_start = self._offset()
                self.end_offset = self._source.find(">", end_start) + 1
                raise _SectionFound()


class SectionParser(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=False)
        self.source = source
        self.nodes = []
        self.stack = []
        self.title_stacks = {title: [] for title in TARGET_TITLES}
        self.line_starts = [0]
        self.line_starts.extend(i + 1 for i, ch in enumerate(source) if ch == "\n")

    def _offset(self):
        line, col = self.getpos()
        return self.line_starts[line - 1] + col

    def handle_starttag(self, tag, attrs):
        start = self._offset()
        raw = self.get_starttag_text() or ""
        node = {
            "tag": tag,
            "attrs": dict(attrs),
            "text": "",
            "start": start,
            "open_end": start + len(raw),
            "close_start": None,
            "full_end": None,
            "parent": self.stack[-1] if self.stack else None,
            "depth": len(self.stack),
        }
        self.nodes.append(node)
        if node["parent"] is not None:
            node["parent"].setdefault("children", []).append(node)
        if tag not in VOID_TAGS:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        start = self._offset()
        raw = self.get_starttag_text() or ""
        node = {
            "tag": tag,
            "attrs": dict(attrs),
            "start": start,
            "open_end": start + len(raw),
            "close_start": start + len(raw),
            "full_end": start + len(raw),
            "parent": self.stack[-1] if self.stack else None,
            "depth": len(self.stack),
        }
        self.nodes.append(node)
        if node["parent"] is not None:
            node["parent"].setdefault("children", []).append(node)

    def handle_endtag(self, tag):
        close_start = self._offset()
        gt = self.source.find(">", close_start)
        full_end = len(self.source) if gt < 0 else gt + 1
        match_index = next((i for i in range(len(self.stack) - 1, -1, -1) if self.stack[i]["tag"] == tag), None)
        if match_index is None:
            return
        for node in self.stack[match_index:]:
            node["close_start"] = close_start
            node["full_end"] = full_end
        del self.stack[match_index:]

    @staticmethod
    def _title_quality(stack):
        heading = [n for n in stack if re.fullmatch(r"h[1-6]", n["tag"])]
        if heading:
            return 2
        titleish = []
        for n in stack:
            classes = n["attrs"].get("class", "").lower().split()
            if any(any(key in cls for key in ("title", "heading", "link-name", "link-label")) for cls in classes):
                titleish.append(n)
        return 1 if titleish else 0

    def handle_data(self, data):
        if not data:
            return
        for node in self.stack:
            node["text"] += data

    def handle_entityref(self, name):
        value = " " if name.lower() in ("nbsp", "thinsp", "ensp", "emsp") else ""
        for node in self.stack:
            node["text"] += value

    def handle_charref(self, name):
        for node in self.stack:
            node["text"] += " "

    def finish_unclosed_nodes(self):
        for node in self.stack:
            if node["full_end"] is None:
                node["close_start"] = len(self.source)
                node["full_end"] = len(self.source)


def find_network_grid(section):
    parser = SectionParser(section)
    parser.feed(section)
    parser.close()
    parser.finish_unclosed_nodes()

    def normalized_text(node):
        return re.sub(r"\s+", " ", node.get("text", "")).strip().upper()

    def titleish(node):
        tag = node["tag"]
        if re.fullmatch(r"h[1-6]", tag):
            return True
        classes = node["attrs"].get("class", "").lower().split()
        return any(any(key in cls for key in ("title", "heading", "link-name", "link-label")) for cls in classes)

    stacks = {}
    for title in TARGET_TITLES:
        # Accumulating descendant text means headings still match when their words
        # are split between nested spans or emphasis tags.
        exact = [n for n in parser.nodes if normalized_text(n) == title]
        candidates = [n for n in exact if titleish(n)]
        if not candidates:
            candidates = [n for n in exact]
        if not candidates:
            # Fallback: allow an exact title within a heading that has extra whitespace.
            candidates = [n for n in parser.nodes if titleish(n) and title in normalized_text(n)]
        if not candidates:
            headings = [
                (n["tag"], n["attrs"].get("class", ""), normalized_text(n)[:100])
                for n in parser.nodes
                if titleish(n) and normalized_text(n)
            ]
            print(f"Network-card title {title!r} not found. Heading-like text detected: {headings[:40]}")
            raise RuntimeError(f"Could not locate the visible {title!r} card title in the network section.")
        # Prefer semantic headings, then the smallest exact text node.
        candidates.sort(key=lambda n: (0 if re.fullmatch(r"h[1-6]", n["tag"]) else 1, len(normalized_text(n)), -n["depth"]))
        node = candidates[0]
        ancestry = []
        current = node
        while current is not None:
            ancestry.append(current)
            current = current["parent"]
        stacks[title] = list(reversed(ancestry))

    common = list(stacks[TARGET_TITLES[0]])
    for title in TARGET_TITLES[1:]:
        other = stacks[title]
        limit = min(len(common), len(other))
        i = 0
        while i < limit and common[i] is other[i]:
            i += 1
        common = common[:i]

    if len(common) < 2:
        raise RuntimeError("Could not determine a shared network-card grid safely; no link was inserted.")
    container = common[-1]
    if container["tag"] == "section" and container.get("attrs", {}).get("id") == "links":
        raise RuntimeError("Network-card titles do not share a grid container; no link was inserted.")
    if container["close_start"] is None:
        raise RuntimeError("The network-card grid has no closing tag; no link was inserted.")
    return container["close_start"]


def main():
    html = INDEX.read_text(encoding="utf-8")
    if LINK_URL.lower() in html.lower():
        print("V23 network link already present; nothing to add.")
        return

    marker = '<section class="section links v150-links" id="links">'
    section_start = html.find(marker)
    if section_start < 0:
        raise SystemExit("Section 09/network marker not found; no link was inserted.")

    end_finder = SectionEndFinder()
    end_rel = end_finder.feed_source(html[section_start:])
    if end_rel is None:
        raise SystemExit("Could not locate the end of Section 09; no link was inserted.")
    section_end = section_start + end_rel
    section = html[section_start:section_end]

    insert_rel = find_network_grid(section)
    insertion_point = section_start + insert_rel
    html = html[:insertion_point] + CARD_HTML + html[insertion_point:]

    if 'id="nh-v23-network-links-css"' not in html:
        head_end = html.lower().rfind("</head>")
        if head_end < 0:
            raise SystemExit("Could not locate </head>; no styling was added.")
        html = html[:head_end] + CSS + "\n" + html[head_end:]

    INDEX.write_text(html, encoding="utf-8")
    print("V23 network link added: GOATD -> " + LINK_URL)


if __name__ == "__main__":
    main()
