# services/extract_transactions_oldmutual.py
from pdf2image import convert_from_path
import pytesseract
import re, json, argparse, getpass
from datetime import datetime
from pathlib import Path

# ---------- 1. OCR ----------
def ocr_pdf_to_text(pdf_path: str,
                    dpi: int = 300,
                    password: str | None = None) -> str:
    # Old Mutual PDFs might be text-based, but we'll keep OCR as fallback
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
      if re.search(r"OLDMUTUAL|MONEYACCOUNT|Statement Period:|Page \d+ of \d+", ln, re.I):
         continue
      if re.search(r"Closing Balance|SAVE ACCOUNT STATEMENT", ln, re.I):
         continue
         
      # Skip summary lines that don't contain transactions
      if re.match(r"Money In|Money Out|Transaction Fees|Notification Fees", ln, re.I):
         continue
         
      # Old Mutual transactions start with date in format DD-MMM-YY or have table structure
      if re.match(r"\d{2}-[A-Za-z]{3}-\d{2}", ln) or "|" in ln:
         cleaned.append(ln)
         
   return cleaned

# ---------- 3. PARSE ----------
def parse_transactions(lines: list[str]) -> list[dict]:
   txs = []
   current_year = "2025"  # This should be extracted from statement header
   
   for line in lines:
      # Skip lines that are clearly not transactions
      if not line or "Transaction Description" in line or "Date    |" in line:
         continue
         
      if "Balance brought forward" in line or "Balance carried forward" in line:
         continue
      
      # Old Mutual format is either pipe-delimited table or space-separated
      if "|" in line:
         parts = [p.strip() for p in line.split("|") if p.strip()]
         if len(parts) < 4:  # Need at least date, description, amount
            continue
               
         date_part = parts[0]
         desc = parts[1]
         amount_part = parts[2] if len(parts) > 2 else None
         balance_part = parts[3] if len(parts) > 3 else None
      else:
         # Try to parse as space-separated
         match = re.match(r"(\d{2}-[A-Za-z]{3}-\d{2})\s+(.+?)\s+(-?\s?\d+\.\d{2})\s+(-?\s?\d+\.\d{2})?", line)
         if not match:
            continue
         date_part, desc, amount_part, balance_part = match.groups()
      
      if not amount_part:
         continue
         
      # Parse date (Old Mutual uses format like "08-Apr-25")
      try:
         date_obj = datetime.strptime(date_part, "%d-%b-%y")
         # Handle century crossover if needed
         if date_obj.year > datetime.now().year:
            date_obj = date_obj.replace(year=date_obj.year - 100)
         date_iso = date_obj.strftime("%Y-%m-%d")
      except:
         continue
         
      # Parse amount (remove spaces between - and number)
      amount_part = amount_part.replace(" ", "")
      try:
         amount = float(amount_part.replace(',', ''))
         # Old Mutual shows debits with negative sign
         if amount < 0:
            direction = "out"
            amount_signed = amount
         elif amount > 0:
            direction = "in"
            amount_signed = amount
         else:
            continue  # Skip zero amounts
      except:
         continue
         
      # Parse balance if available
      balance = None
      if balance_part:
         try:
            balance_part = balance_part.replace(" ", "").replace(",", "")
            balance = float(balance_part)
         except:
            pass
      
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
      description="Extract transactions from Old Mutual PDF statements."
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