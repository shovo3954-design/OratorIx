from pathlib import Path
import re


ROOT = Path(r"C:\Users\shovo\Words_Game")
PDF_TEXT = ROOT / "TOPIK-I-1671.txt"
DATA_JS = ROOT / "js" / "data.js"
APP_JS = ROOT / "js" / "app.js"


PERSONAL_PRONOUNS = {"나", "내", "내가", "너", "누가", "누구", "누구는", "누구를", "당신", "저", "저희", "우리", "자기", "자신", "서로", "그", "그거", "그것", "그곳", "그날", "그들", "그때", "그분", "그쪽", "이", "이거", "이것", "이곳", "이따가", "이런", "이렇게", "이분", "이쪽", "저거", "저것", "저곳", "저기", "저분", "저쪽", "어느", "어떤", "어디", "무슨", "무엇", "뭐"}
CONJUNCTIONS = {"and", "but", "however", "or", "so", "thus", "because", "then", "while", "nevertheless", "because", "if", "yet", "although"}
PREPOSITIONS = {"at", "of", "in", "on", "to", "from", "with", "without", "between", "among", "under", "over", "before", "after", "through", "across", "near", "around", "beside", "toward", "towards"}
INTERJECTIONS = {"yes", "yeah", "no", "hi", "hello", "well", "oh", "thank", "thank you", "sorry", "congratulations", "cheers"}
ADJECTIVE_STARTS = {
    "big", "small", "long", "short", "tall", "wide", "narrow", "thick", "thin", "heavy", "light",
    "fast", "slow", "high", "low", "hot", "cold", "warm", "cool", "good", "bad", "easy", "difficult",
    "hard", "simple", "cheap", "expensive", "free", "clean", "dirty", "beautiful", "pretty", "ugly",
    "happy", "sad", "angry", "hungry", "thick", "sweet", "spicy", "sour", "delicious", "many",
    "few", "far", "near", "close", "new", "old", "young", "busy", "free", "safe", "dangerous",
    "funny", "fun", "interesting", "boring", "important", "quiet", "noisy", "comfortable", "easy",
    "kind", "friendly", "difficult", "different", "same", "similar", "wrong", "right", "bright",
    "dark", "dry", "wet", "wide", "thick", "thin", "narrow", "thick", "heavy", "light"
}

NUMBER_KOREAN = {
    "하나","두","둘","셋","넷","다섯","여섯","일곱","여덟","아홉","열","스물","서른","마흔","쉰","예순","일흔","여든","아흔",
    "십","백","천","만","구십","일","이","삼","사","오","육","칠","팔","구",
}


def parse_rows():
    rows = []
    for line in PDF_TEXT.read_text(encoding="utf-8").splitlines():
        match = re.match(r"^\s*(\d+)\s+(\S+)\s+(.+?)\s+(\d+)\s+(\S+)\s+(.+?)\s*$", line)
        if not match:
            continue
        for number, term, english in (
            (int(match.group(1)), match.group(2), match.group(3).strip()),
            (int(match.group(4)), match.group(5), match.group(6).strip()),
        ):
            rows.append((number, term, english))
    return rows


def classify_pos(term, english):
    lowered = english.lower().strip()
    first = lowered.split()[0].strip("~")
    if term in NUMBER_KOREAN or re.fullmatch(r"\d+(st|nd|rd|th)?", first):
        return "Number"
    if term in PERSONAL_PRONOUNS or first in {"who", "what", "where", "which", "how", "any", "all", "both", "each", "everyone", "everything"}:
        return "Pronoun"
    if first in CONJUNCTIONS or first in {"and", "or", "but"}:
        return "Conjunction"
    if any(lowered.startswith(word + " ") for word in PREPOSITIONS) or term.endswith(("에", "에서", "으로", "로", "까지", "부터")):
        return "Preposition"
    if lowered in INTERJECTIONS or first in {"yes", "yeah", "no", "hi", "hello", "oh", "sorry", "thanks"}:
        return "Interjection"
    if term.endswith(("히", "게", "로", "뿐", "서")) and not term.endswith("하다"):
        return "Adverb"
    if term.endswith("다"):
        if first in ADJECTIVE_STARTS or lowered.startswith(("be ", "become ", "feel ", "look ", "seem ", "have ")) or lowered.endswith(("ry", "ful", "able", "less", "ous", "ive")):
            return "Adjective"
        return "Verb"
    if first in {"always", "often", "sometimes", "usually", "never", "suddenly", "together", "alone", "almost", "very", "soon", "again", "quickly", "slowly", "really", "first", "later", "now", "here", "there"}:
        return "Adverb"
    return "Noun"


def category_for(term, english, pos):
    lowered = english.lower()
    rules = [
        ("People & Family", ["person", "people", "father", "mother", "brother", "sister", "family", "husband", "wife", "child", "baby", "student", "teacher", "doctor", "police"]),
        ("Food & Drink", ["food", "meal", "rice", "bread", "tea", "coffee", "milk", "water", "fruit", "vegetable", "soup", "meat", "fish", "egg", "beer", "drink"]),
        ("Travel & Places", ["city", "town", "country", "place", "street", "station", "airport", "country", "travel", "road", "subway", "bus", "train", "plane", "airplane"]),
        ("Body & Health", ["body", "head", "eye", "hand", "foot", "leg", "arm", "health", "hospital", "medicine", "patient", "doctor", "nurse", "cold", "hurt", "pain"]),
        ("Time & Calendar", ["time", "day", "week", "month", "year", "morning", "afternoon", "evening", "night", "today", "tomorrow", "yesterday", "Monday", "Tuesday"]),
        ("Home & Furniture", ["house", "home", "room", "bed", "desk", "chair", "table", "door", "window", "kitchen", "bathroom", "furniture"]),
        ("Work & School", ["school", "office", "job", "work", "study", "class", "book", "student", "teacher", "company", "employee"]),
        ("Shopping & Money", ["price", "money", "shop", "store", "buy", "sell", "bank", "ticket", "cost", "expensive", "cheap"]),
        ("Nature & Weather", ["weather", "rain", "snow", "wind", "sun", "sky", "flower", "tree", "mountain", "river", "sea", "spring", "summer", "fall", "winter"]),
        ("Animals", ["dog", "cat", "animal", "bird", "horse", "pig", "cow", "fish", "chicken", "puppy", "tiger"]),
        ("Communication", ["word", "speak", "talk", "say", "message", "phone", "letter", "news", "language", "conversation"]),
        ("Feelings & Thoughts", ["happy", "sad", "love", "hate", "think", "feeling", "want", "angry", "glad", "worry", "know", "remember"]),
        ("Clothing", ["clothes", "shirt", "pants", "shoe", "shoes", "coat", "bag", "hat", "wear", "dress"]),
    ]
    for name, words in rules:
        if any(word in lowered for word in words):
            return name
    if pos in {"Pronoun", "Preposition", "Conjunction", "Interjection", "Adverb", "Number"}:
        return pos
    return "General"


def roman_placeholder(term):
    return ""


def js_string(value):
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"').replace("\n", " ") + '"'


def main():
    data = DATA_JS.read_text(encoding="utf-8")
    existing = set(re.findall(r'term\s*:\s*"([^"]+)"', data))
    rows = parse_rows()
    unique = {}
    for number, term, english in rows:
        unique.setdefault(term, (number, english))

    missing = [(number, term, english) for term, (number, english) in unique.items() if term not in existing]
    counters = {}
    entries = []
    for number, term, english in missing:
        pos = classify_pos(term, english)
        section = pos if pos in {"Noun", "Pronoun", "Adjective", "Adverb", "Preposition", "Conjunction", "Interjection", "Phrase", "Number", "Verb"} else "Mixed vocabulary"
        category = category_for(term, english, pos)
        key = (section, category)
        counters[key] = counters.get(key, 0) + 1
        cls = ((counters[key] - 1) // 20) + 1
        entry_id = f"topik1-{number}"
        fields = [
            f'id: {js_string(entry_id)}',
            f'term: {js_string(term)}',
            f'pos: {js_string(pos)}',
            f'section: {js_string(section)}',
            f'level: "Beginner"',
            f'category: {js_string("TOPIK I - " + category)}',
            f'cls: {cls}',
            f'def: {js_string(english)}',
            'status: "new"',
        ]
        entries.append("  { " + ", ".join(fields) + " }")

    block = ",\n\n  // ===== TOPIK I PDF IMPORT (missing terms only) =====\n" + ",\n".join(entries)
    marker = "\n];\n\n// ===== 3. VERBS ====="
    if marker not in data:
        raise RuntimeError("Could not find DEFAULT_KO closing marker")
    data = data.replace(marker, block.rstrip("\n") + marker, 1)
    DATA_JS.write_text(data, encoding="utf-8")

    app = APP_JS.read_text(encoding="utf-8")
    app = app.replace(
        'const SECTIONS = ["Mixed vocabulary", "Noun", "Pronoun", "Adjective", "Adverb", "Preposition", "Conjunction", "Interjection", "Phrase", "Number"];',
        'const SECTIONS = ["Mixed vocabulary", "Noun", "Pronoun", "Adjective", "Adverb", "Verb", "Preposition", "Conjunction", "Interjection", "Phrase", "Number"];',
    )
    APP_JS.write_text(app, encoding="utf-8")

    print(f"PDF rows: {len(rows)}")
    print(f"Unique PDF terms: {len(unique)}")
    print(f"Existing exact matches preserved: {len(unique) - len(missing)}")
    print(f"Missing terms added: {len(missing)}")


if __name__ == "__main__":
    main()
