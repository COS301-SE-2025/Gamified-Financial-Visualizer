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

# ---------- 2. PRE-CLEAN ----------
def clean_lines(raw: str) -> list[str]:
   cleaned = []

   for ln in raw.splitlines():
      ln = ln.strip()

      # Skip header/footer lines and empty lines
      if not ln:
         continue
      if re.search(r"Standard Bank| |Statement No:|Page \d+ of \d+", ln, re.I):
         continue
      if re.search("Statement from ", ln):
         # Extract year from statement header
         match = re.search(r"(\d{4})", ln)
         if match:
            year = match.group(1)
         continue
      if re.search(r"VAT Summary|Account Summary|Details of Agreement", ln, re.I):
         continue
         
      # Skip balance lines that don't contain transactions
      if re.match(r"BALANCE (BROUGHT FORWARD|CARRIED FORWARD)", ln, re.I):
         continue
         
      # Standard Bank transactions start with description or date
      if re.match(r"\d{2}\s+\d{2}|[A-Z]", ln):
         cleaned.append(ln)
         
   return cleaned

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
   txs = []
   current_year = year  # This should be extracted from statement header
   
   for line in lines:
      # Standard Bank format: Description Date(MM DD) Amount Balance
      parts = re.split(r'\s{2,}', line.strip())  # Split on multiple spaces
      
      if len(parts) < 3:
         continue
         
      # Extract description (might be multiple parts)
      desc_parts = []
      i = 0
      while i < len(parts) and not re.match(r'\d{2}\s+\d{2}', parts[i]):
         desc_parts.append(parts[i])
         i += 1
         
      if i >= len(parts):
         continue
         
      desc = ' '.join(desc_parts)
      date_part = parts[i]
      amount_part = parts[i+1] if i+1 < len(parts) else None
      balance_part = parts[i+2] if i+2 < len(parts) else None
      
      if not amount_part:
         continue
         
      # Parse date (Standard Bank uses format like "03 22" for March 22)
      try:
         month, day = date_part.split()
         date_iso = f"{current_year}-{month}-{day}"
      except:
         continue
         
      # Parse amount
      try:
         amount = float(amount_part.replace(',', ''))
         # Standard Bank shows debits with negative sign
         if '-' in amount_part:
            direction = "out"
            amount_signed = -abs(amount)
         else:
            direction = "in"
            amount_signed = amount
      except:
         continue
         
      # Parse balance if available
      balance = float(balance_part.replace(',', '')) if balance_part else None
      
      txs.append({
         "date": date_iso,
         "description": desc.strip(),
         "amount": amount_signed,
         "direction": direction,
         "balance": balance
      })
   
   return txs

# ---------- ORCHESTRATOR ----------
def pdf_to_json(pdf_path: str,
                out: str | Path = "../data/transactions.json",
                password: str | None = None) -> None:
   raw = ocr_pdf_to_text(pdf_path, password=password)
   lines = clean_lines(raw)
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