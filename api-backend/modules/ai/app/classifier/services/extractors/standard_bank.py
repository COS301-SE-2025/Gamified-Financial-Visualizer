# services/extract_transactions_standard.py
from pdf2image import convert_from_path
import pytesseract
import re, json, argparse, getpass
from datetime import datetime
from pathlib import Path

year = datetime.now().year

# ---------- 1. OCR ----------
def ocr_pdf_to_text(pdf_path: str,
                    dpi: int = 300,
                    password: str | None = None) -> str:
   # Standard Bank PDFs might be text-based, but we'll keep OCR as fallback
   pages = convert_from_path(pdf_path, dpi=dpi, userpw=password)
   return "\n".join(
      pytesseract.image_to_string(p, config="--psm 6") for p in pages
   )

# patterns to completely ignore
SKIP_PATTERNS = [
    r"BALANCE BROUGHT FORWARD",
    r"BALANCE CARRIED FORWARD",
    r"Total charge amount",
    r"Total VAT",
    r"Balance at date of statement",
    r"Details of Agreement",
    r"Statement from",
    r"Standard Bank",
    r"Page \d+ of \d+",
    # etc…
]

# this matches lines that end …<MM> <DD> <amount> [<balance>]
TXN_PATTERN = re.compile(
    r""".+           # description (at least one char)
       \s+           # some spacing
       (\d{2}\s+\d{2})      # MM DD
       \s+
       [+-]?\d[\d,]*\.\d{2}  # amount
       (?:\s+\d[\d,]*\.\d{2})?  # optional balance
       $""",
    re.X
)

# ---------- 2. PRE-CLEAN ----------
def clean_lines(raw: str) -> list[str]:
   lines = raw.splitlines()
   in_tx_section = False
   raw_txns: list[str] = []

   # 1) isolate just the transaction block
   for ln in lines:
      ln = ln.strip()
      if not ln:
         continue

      if ln.lower().startswith("statement from"):
         year_match = re.search(r"\d{4}", ln)
         if year_match:
            global year
            year = int(year_match.group(0))
         continue

      # start collecting after “Details Service…”
      if ln.lower().startswith("details service"):
         in_tx_section = True
         continue

      if ln.startswith("BALANCE BROUGHT FORWARD"):
         continue

      # stop at “VAT Summary” or “Account Summary”
      if in_tx_section and re.search(r"vat summary|account summary", ln, re.I):
         break

      if not in_tx_section:
         continue

      # skip the “Fee” header line
      if ln.lower() == "fee":
         continue

      # keep _all_ lines in the tx section for now
      raw_txns.append(ln)

   # 2) merge each detail‐line (has a decimal) with its follow-on description (no decimal)
   merged: list[str] = []
   i = 0
   while i < len(raw_txns):
      line = raw_txns[i]
      # if the next line has NO decimal, it's just a continuation
      if i + 1 < len(raw_txns) and not re.search(r"\d+\.\d{2}", raw_txns[i+1]):
         merged.append(f"{line} {raw_txns[i+1]}")
         i += 2
      else:
         merged.append(line)
         i += 1

   # 3) drop any stragglers without a decimal (should all be real txns now)
   return [ln for ln in merged if re.search(r"\d+\.\d{2}", ln)]

# ---------- 3. PARSE ----------
TX_PATTERN = re.compile(
    r"""^(?P<desc>.+?)
       \s+(?P<date>\d{2}\s+\d{2})     # Standard Bank uses MM DD format
       \s+(?P<amount>[+-]?\d+\.\d{2})
       (?:\s+(?P<bal>\d+\.\d{2}))?    # optional balance
    $""",
    re.X,
)

def parse_transactions(lines: list[str]) -> list[dict]:
   merged = []
   i = 0
   while i < len(lines):
      ln = lines[i]
      # If this line ends with "amount date(4digits) balance" and the next line has no amount,
      # join them into one.
      if i + 1 < len(lines) and \
         re.search(r'\d+\.\d{2}\s+\d{4}\s+\d+\.\d{2}$', ln) and \
         not re.search(r'\d+\.\d{2}', lines[i+1]):
         ln = ln + ' ' + lines[i+1]
         merged.append(ln)
         i += 2
      else:
         merged.append(ln)
         i += 1

   # 2) Now extract fields from each merged line:
   pattern = re.compile(r"""
      ^(?P<desc>.+?)                       # description up to amount
      \s+
      (?P<amount>[+-]?\d+\.\d{2}-?)        # amount, maybe trailing '-' for debit
      \s+
      (?P<date>\d{4}|\d{2}\s+\d{2})        # either '0322' or '03 22'
      \s+
      (?P<balance>\d+\.\d{2})              # ending balance
      (?:\s+(?P<extra>.*))?                # any leftover text
      $
   """, re.X)

   txs = []
   current_year = datetime.now().year

   for ln in merged:
      m = pattern.match(ln)
      if not m:
         continue

      # rebuild full description
      desc = m.group("desc").strip()
      extra = (m.group("extra") or "").strip()
      full_desc = f"{desc} {extra}".strip()

      # parse amount (+/-)
      amt_str = m.group("amount")
      is_negative = amt_str.endswith("-")
      if is_negative:
         amt_str = amt_str[:-1]
      amount = -float(amt_str) if is_negative else float(amt_str)
      direction = "out" if is_negative else "in"

      # parse date
      date_raw = m.group("date").replace(" ", "")
      month = date_raw[:2]
      day   = date_raw[-2:]
      dt = datetime.strptime(f"{current_year}-{month}-{day}", "%Y-%m-%d")
      date_iso = dt.strftime("%Y-%m-%d")

      # parse balance
      balance = float(m.group("balance"))

      txs.append({
         "date":        date_iso,
         "description": full_desc,
         "amount":      amount,
         "direction":   direction,
         "balance":     balance
      })

   return txs

# ---------- ORCHESTRATOR ----------
def pdf_to_json(pdf_path: str,
                out: str | Path = "../data/transactions.json",
                password: str | None = None) -> None:
   raw = ocr_pdf_to_text(pdf_path, password=password)
   lines = clean_lines(raw)
   print("---- CLEANED LINES ----")
   for ln in lines[:10]:
      print(repr(ln))
   print("-----------------------")
   txs = parse_transactions(lines)
   
   with open(out, "w") as f:
      json.dump(txs, f, indent=2)
   
   print(f"✅ Saved {len(txs)} transactions → {out}")

# ---------- CLI ----------
if __name__ == "__main__":
   parser = argparse.ArgumentParser(
      description="Extract transactions from Standard Bank PDF statements."
   )
   parser.add_argument("pdf", help="Path to bank-statement PDF")
   parser.add_argument(
      "-o", "--out", default="transactions.json", help="Output JSON file"
   )
   parser.add_argument(
      "--password", help="PDF password (leave blank to prompt)"
   )
   args = parser.parse_args()

   pwd = args.password
   if pwd is None:
      pwd = getpass.getpass("PDF password (leave empty if none): ") or None
   pdf_to_json(args.pdf, out=args.out, password=pwd)