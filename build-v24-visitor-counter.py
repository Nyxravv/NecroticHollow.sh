from pathlib import Path

INDEX = Path("index.html")
html = INDEX.read_text(encoding="utf-8")

# The old V17.5 localStorage fallback is per-browser, not a global visitor count.
# Do not expose it under the global visitor-count label.
local_start_marker = "const hasVisited = localStorage.getItem('nh-v175-visitor') === '1';"
local_end_marker = "if(visitorCount) visitorCount.textContent = " + chr(96) + "VISITOR COUNT: $" + "{localVisitCount}" + chr(96) + ";"
local_start = html.find(local_start_marker)
if local_start >= 0:
    local_end = html.find(local_end_marker, local_start)
    if local_end < 0:
        raise SystemExit("Could not safely replace the local visitor fallback.")
    local_end += len(local_end_marker)
    replacement = chr(10).join([
        "if(visitorCount){",
        "  visitorCount.textContent = 'VISITOR COUNT: CONNECTING';",
        "  visitorCount.dataset.counterStatus = 'checking';",
        "}"
    ])
    html = html[:local_start] + replacement + html[local_end:]
elif "visitorCount.dataset.counterStatus = 'checking';" not in html:
    raise SystemExit("Could not find the local visitor fallback to replace.")

# The HTML default is also changed so a blocked JavaScript request never flashes a
# misleading zero as if it were the global total.
html = html.replace(
    '<strong id="visitorCount">VISITOR COUNT: 0</strong>',
    '<strong id="visitorCount" data-counter-status="checking">VISITOR COUNT: CONNECTING</strong>',
    1
)

start_marker = "/* V19.5 — fresh global visitor counter."
start = html.find(start_marker)
if start < 0:
    if "/* V24.0 — resilient global visitor counter." in html:
        INDEX.write_text(html, encoding="utf-8")
        print("V24 visitor counter fix already present.")
        raise SystemExit(0)
    raise SystemExit("Could not find the V19.5 global counter integration.")

end_marker = chr(10) + "})();"
end = html.find(end_marker, start)
if end < 0:
    raise SystemExit("Could not find the end of the global counter integration.")
end += len(end_marker)

replacement = r"""/* V24.0 — resilient global visitor counter.
   Never present a local-browser number as the site-wide total.
   CounterAPI.com was timing out during health checks, so retry once and show
   an explicit unavailable state if the service still does not respond. */
(async () => {
  const countEl = document.getElementById('visitorCount');
  const deviceEl = document.getElementById('visitorDevice');
  if (!countEl) return;

  const endpoint = 'https://counterapi.com/api/necrotichollow.sh/view/portfolio-v195?unique=true&startNumber=0&noFormatting=true';
  const maxAttempts = 2;
  const sleep = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  function updateDeviceLabel() {
    if (!deviceEl) return;
    const ua = navigator.userAgent || '';
    const w = window.innerWidth;
    const device = /iPad|Tablet/i.test(ua) || (w >= 600 && w <= 1100)
      ? 'TABLET'
      : /Mobile|iPhone|iPod|Android/i.test(ua) || w < 600
        ? 'MOBILE'
        : 'DESKTOP';
    deviceEl.textContent = 'DEVICE // ' + device + ' NODE';
  }

  async function fetchGlobalCount() {
    countEl.textContent = 'VISITOR COUNT: CONNECTING';
    countEl.dataset.counterStatus = 'checking';

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 5000);
      let success = false;

      try {
        const response = await fetch(endpoint, {
          cache: 'no-store',
          mode: 'cors',
          credentials: 'omit',
          signal: controller.signal
        });
        if (!response.ok) throw new Error('Counter API HTTP ' + response.status);

        const data = await response.json();
        if (!data || typeof data.value !== 'number' || !Number.isFinite(data.value) || data.value < 0) {
          throw new Error('Counter API returned an invalid count.');
        }

        countEl.textContent = 'VISITOR COUNT: ' + String(data.value);
        countEl.dataset.counterStatus = 'online';
        countEl.removeAttribute('title');
        success = true;
        return true;
      } catch (error) {
        console.warn('V24 global visitor counter request ' + attempt + ' failed.', error);
      } finally {
        window.clearTimeout(timeoutId);
      }

      if (!success && attempt < maxAttempts) await sleep(900);
    }

    countEl.textContent = 'VISITOR COUNT: UNAVAILABLE';
    countEl.dataset.counterStatus = 'offline';
    countEl.title = 'The global visitor-count service did not respond. The total is temporarily unavailable.';
    return false;
  }

  updateDeviceLabel();
  const online = await fetchGlobalCount();

  if (!online) {
    // Make one delayed recovery attempt and retry when the visitor returns to the tab.
    window.setTimeout(() => {
      if (document.visibilityState === 'visible') void fetchGlobalCount();
    }, 30000);

    const retryWhenVisible = () => {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', retryWhenVisible);
      void fetchGlobalCount();
    };
    document.addEventListener('visibilitychange', retryWhenVisible);
  }
})();"""

html = html[:start] + replacement + html[end:]
INDEX.write_text(html, encoding="utf-8")
print("V24 counter failure handling installed: no false local global count, bounded retry, and recovery attempt.")
