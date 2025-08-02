import re

# ---------- Normalize descriptions ----------
def normalize_description(text: str) -> str:
   """
   Cleans bank transaction descriptions for model training/inference:
   - Lowercases
   - Removes card numbers, punctuation, random codes
   - Collapses whitespace
   """
   text = text.lower()
   text = re.sub(r"[^\w\s]", " ", text)            # remove punctuation
   text = re.sub(r"\b\d{4,}\b", "", text)        # remove long numeric tokens (e.g. card suffixes)
   text = re.sub(r"\s{2,}", " ", text).strip()   # normalize spacing
   return text

# ---------- Keyword matching ----------
def keyword_match_category(desc: str, category_keywords: dict) -> str | None:
    desc_lower = desc.lower()
    for category, keywords in category_keywords.items():
        for kw in keywords:
            if kw in desc_lower:
                return category
    return None

# ---------- Build text from transaction row ----------
def build_text(description: str, amount: float | str = "", tx_type: str = "") -> str:
   """
   Combines description, amount, and transaction type into a single model input string.
   """
   desc = normalize_description(description)
   return f"{desc} {amount} {tx_type}".strip()