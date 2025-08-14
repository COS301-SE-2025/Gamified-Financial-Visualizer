# services/extract_transactions_fnb.py
from pdf2image import convert_from_path
import pytesseract
import re, json, argparse, getpass
from datetime import datetime
from pathlib import Path

# ---------- 1. OCR ----------
def ocr_pdf_to_text(pdf_path: str,
                    dpi: int = 300,
                    password: str | None = None) -> str:
    # FNB PDFs might be text-based, but we'll keep OCR as fallback
    pages = convert_from_path(pdf_path, dpi=dpi, userpw=password)
    return "\n".join(
        pytesseract.image_to_string(p, config="--psm 6") for p in pages
    )

# ---------- 2. PRE-CLEAN ----------
def clean_lines(raw: str) -> list[str]:
   cleaned = []
   for ln in raw.splitlines():
      ln = ln.strip()
      if not ln:
         continue

      # skip only these exact patterns
      if re.search(r"^(FNB|Statement Period:|Page \d+ of \d+)$", ln, re.I):
         continue
      if re.search(r"Opening Balance|Closing Balance|Total VAT|Turnover for Statement Period", ln, re.I):
         continue

      # now pick up either table rows
      if "|" in ln or re.match(r"\d{1,2}\s+[A-Za-z]{3}", ln):
         cleaned.append(ln)

   return cleaned

# ---------- 3. PARSE ----------
def extract_statement_year(raw_text: str) -> str:
   """Extract the year from the statement period line"""
   match = re.search(r"Statement Period\s*:\s*(\d{1,2}\s+[A-Za-z]+\s+(\d{4}))", raw_text)
   if match:
      return match.group(2)
   return datetime.now().strftime("%Y")  # fallback to current year

def parse_transactions(lines: list[str], statement_year: str) -> list[dict]:
   txs = []
   
   for ln in lines:
      # we know clean_lines already only yielded “date | rest…” lines
      if not ln or "Description" in ln or "Date\s+\|" in ln:
         continue

      if "|" not in ln:
         continue
      
      date_part, rest = ln.split("|", 1)
      date_part = date_part.strip()
      rest = rest.strip()
      
      # now pull off “amount” + “balance” from the *end* of the rest
      # most FNB rows look like:
      #   DESCRIPTION [maybe with spaces]  AMOUNT  BALANCE
      m = re.match(r"(.+?)\s+(-?[\d,]+\.\d{2}(?:Cr)?)\s+(-?[\d,]+\.\d{2})", rest)
      if not m:
         continue
      desc, amount_token, balance_token = m.groups()
      
      # parse the date
      try:
         date_obj = datetime.strptime(f"{date_part} {statement_year}", "%d %b %Y")
         date_iso = date_obj.strftime("%Y-%m-%d")
      except:
         continue
      
      # parse amount & direction
      is_credit = amount_token.endswith("Cr")
      amt = float(amount_token.rstrip("Cr").replace(",", ""))
      if is_credit:
         direction = "in"
         amount_signed = amt
      elif "Purchase" in desc or "Payment" in desc:
         direction = "out"
         amount_signed = -abs(amt)  
      else:
         direction = "out"
         amount_signed = -abs(amt)
      
      # parse balance
      try:
         balance = float(balance_token.replace(",", ""))
      except:
         balance = None
      
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
   statement_year = extract_statement_year(raw)
   lines = clean_lines(raw)
   txs = parse_transactions(lines, statement_year)
   
   with open(out, "w") as f:
      json.dump(txs, f, indent=2)
   
   print(f"✅ Saved {len(txs)} transactions → {out}")

# ---------- CLI ----------
if __name__ == "__main__":
   parser = argparse.ArgumentParser(
      description="Extract transactions from FNB PDF statements."
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