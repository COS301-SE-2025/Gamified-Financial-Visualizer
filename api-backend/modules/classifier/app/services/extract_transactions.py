# services/extract_transactions.py
from pdf2image import convert_from_path           # needs poppler-utils present
import pytesseract                                # needs tesseract-ocr installed
import re, json
from datetime import datetime
from pathlib import Path
# import logging
import { logger }     from '../../config/logger';  

# ---------- 1. OCR ----------
def ocr_pdf_to_text(pdf_path: str, dpi: int = 300) -> str:
   pages = convert_from_path(pdf_path, dpi=dpi)
   # PSM-6 = assume a “block of text” per page – good for statements
   return "\n".join(pytesseract.image_to_string(p, config="--psm 6") for p in pages)


# ---------- 2. PRE-CLEAN ----------
def clean_lines(raw: str) -> list[str]:
   cleaned = []
   for ln in raw.splitlines():
      ln = ln.strip()

      # Skip obvious noise (tweak to your statement)
      if not ln or re.search(r"Page\s+\d+\s+of", ln, re.I):
         continue
      if re.match(r"^(Account|Statement|Available|Closing|Opening)\b", ln, re.I):
         continue

      # If the line starts with a date, start a new record;
      # otherwise append to previous line (handles wrapped descriptions)
      if re.match(r"\d{2}/\d{2}/\d{4}", ln):
         cleaned.append(ln)
      elif cleaned:
         cleaned[-1] += " " + ln   # merge with previous
   return cleaned


# ---------- 3. PARSE ----------
TX_PATTERN = re.compile(
   r"""^(?P<date>\d{2}/\d{2}/\d{4})        # 01/05/2025
      \s+(?P<desc>.+?)\s+
      (?P<amount>[+-]?\(?\d[\d,]*\.\d{2}\)?)   #  -56.20  or (56.20)
      (?:\s+(?P<bal>[+-]?\d[\d,]*\.\d{2}))?    # optional balance
   $""",
   re.X,
)

NUM_RE = re.compile(r"\d[\d,]*\.\d{2}")          # matches 1 234.56 alike

def to_float(txt: str) -> float:
    return float(txt.replace(",", ""))

def classify_row(nums: list[str], prev_balance: float | None):
   """
   nums = list of 2-3 numeric strings found on a row.
   Returns (amount_signed, balance, direction) or (None, None, None) if undecidable.
   """
   if len(nums) == 3:                    # debit  credit  balance
      debit, credit, bal = nums
      bal = to_float(bal)
      if debit.strip():                 # debit column occupied  ⇒  money IN
         amt =  to_float(debit)
         return  amt, bal, "in"
      elif credit.strip():              # credit column occupied  ⇒  money OUT
         amt = -to_float(credit)
         return  amt, bal, "out"
      else:
         return None, None, None

   if len(nums) == 2:                    # amount  balance
      amt_raw, bal = nums
      bal = to_float(bal)
      amt = to_float(amt_raw)

      if prev_balance is None:
         # Opening balance line – treat as money IN so balance is valid
         return amt, bal, "in"

      # Compare balances: increase ⇒ income, decrease ⇒ expense
      if bal > prev_balance:
         return  amt, bal, "in"
      elif bal < prev_balance:
         return -amt, bal, "out"
      else:
         return None, None, None      # anomalous

   return None, None, None              # not enough numbers

def parse_transactions(lines: list[str]) -> list[dict]:
   txs, prev_bal = [], None

   for raw in lines:
      # Some OCR rows contain 2 statements fused together – split by 2nd date
      for ln in re.split(r"(?=\d{2}/\d{2}/\d{4})", raw):
         ln = ln.strip()
         if not ln:
               continue

         nums = NUM_RE.findall(ln)
         if len(nums) < 2:
               continue

         # Chop numbers off the right to isolate leading date + description
         tail_removed = ln
         for n in reversed(nums):
               tail_removed = tail_removed.rsplit(n, 1)[0]
         try:
               date_raw, desc = tail_removed.strip().split(" ", 1)
               date_iso = datetime.strptime(date_raw, "%d/%m/%Y").strftime("%Y-%m-%d")
         except ValueError:
               continue  # malformed

         amt_signed, balance, direction = classify_row(nums, prev_bal)
         if direction is None:
               continue

         txs.append({
               "date":        date_iso,
               "description": desc.strip(),
               "amount":      amt_signed,       # + = income, – = expense
               "direction":   direction,        # "in" | "out"
               "balance":     balance
         })
         prev_bal = balance

   return txs




# ---------- ORCHESTRATOR ----------
def pdf_to_json(pdf_path: str, out: str | Path = "transactions.json") -> None:
   raw = ocr_pdf_to_text(pdf_path)
   lines = clean_lines(raw)
   txs  = parse_transactions(lines)
   with open(out, "w") as f:
      json.dump(txs, f, indent=2)
   print(f"✅ Saved {len(txs)} transactions → {out}")
   logger.info(f"✅ Saved {len(txs)} transactions → {out}")


if __name__ == "__main__":
   pdf_to_json("./data/nedbank.pdf")
