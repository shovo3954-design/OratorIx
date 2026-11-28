from pathlib import Path
from collections import Counter
import re


ROOT = Path(r"C:\Users\shovo\Words_Game")
DATA = (ROOT / "js" / "data.js").read_text(encoding="utf-8")
PDF_TEXT = (ROOT / "TOPIK-I-1671.txt").read_text(encoding="utf-8")


terms = re.findall(r'term\s*:\s*"([^"]+)"', DATA)
ids = re.findall(r'id\s*:\s*"([^"]+)"', DATA)
term_counts = Counter(terms)
id_counts = Counter(ids)

pdf_terms = set()
for line in PDF_TEXT.splitlines():
    match = re.match(r"^\s*\d+\s+(\S+)\s+(.+?)\s+\d+\s+(\S+)\s+(.+?)\s*$", line)
    if match:
        pdf_terms.update((match.group(1), match.group(3)))

missing_pdf = [
    "행사", "허리", "현금", "현재", "형", "형님", "형제", "호", "호랑이"
]
pdf_terms.update(missing_pdf)

data_terms = set(terms)
duplicates = sorted(term for term, count in term_counts.items() if count > 1)
duplicate_ids = sorted(identifier for identifier, count in id_counts.items() if count > 1)

print("Total term entries:", len(terms))
print("Duplicate exact terms:", len(duplicates))
print("Duplicate IDs:", len(duplicate_ids))
print("TOPIK import entries:", len(re.findall(r'topik1-\d+', DATA)))
print("Double-comma occurrences:", DATA.count("},,"))
print("PDF terms covered:", len(pdf_terms & data_terms), "of", len(pdf_terms))
print("PDF terms missing:", sorted(pdf_terms - data_terms))
korean_duplicates = sorted(term for term in duplicates if re.search(r"[가-힣]", term))
print("Korean duplicate exact terms:", len(korean_duplicates))
print("Duplicate ID values:", duplicate_ids)
