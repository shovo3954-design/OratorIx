from pathlib import Path
import re


DATA = Path(r"C:\Users\shovo\Words_Game\js\data.js")
text = DATA.read_text(encoding="utf-8")
start = text.index("// ===== 2. KOREAN WORDS =====")
end = text.index("// ===== 3. VERBS =====")
head, korean, tail = text[:start], text[start:end], text[end:]

seen_terms = set()
seen_ids = set()
removed = 0
fixed_lines = []

for line in korean.splitlines(keepends=True):
    match = re.match(r'^\s*\{\s*id:\s*"([^"]+)".*?\bterm:\s*"([^"]+)".*?\},?\s*$', line)
    if not match:
        fixed_lines.append(line)
        continue

    identifier, term = match.groups()
    duplicate_term = re.search(r"[가-힣]", term) and term in seen_terms
    duplicate_id = identifier in seen_ids
    if duplicate_term or duplicate_id:
        removed += 1
        continue

    seen_ids.add(identifier)
    if re.search(r"[가-힣]", term):
        seen_terms.add(term)
    fixed_lines.append(line)

DATA.write_text(head + "".join(fixed_lines) + tail, encoding="utf-8")
print("Removed duplicate Korean terms or IDs:", removed)
