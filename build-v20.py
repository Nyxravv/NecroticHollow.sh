from pathlib import Path

index = Path('index.html')
text = index.read_text(encoding='utf-8')

marker = '<script src="v20-interactions.js"></script>'
if marker not in text:
    if '</body>' in text.lower():
        # Preserve the existing document and inject immediately before </body>.
        lower = text.lower()
        pos = lower.rfind('</body>')
        text = text[:pos] + f'\n{marker}\n' + text[pos:]
    else:
        # Safety fallback for an unusual static document.
        text += f'\n{marker}\n'
    index.write_text(text, encoding='utf-8')
    print('V20 interaction layer injected.')
else:
    print('V20 interaction layer already present; no change needed.')
