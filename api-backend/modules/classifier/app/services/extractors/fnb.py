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
      
      # Skip header/footer lines and empty lines
      if not ln:
         continue
      if re.search(r"FNB| |Statement Period:|Page \d+ of \d+", ln, re.I):
         continue
      if re.search(r"Closing Balance|Turnover for Statement Period", ln, re.I):
         continue
         
      # Skip summary lines that don't contain transactions
      if re.match(r"Opening Balance|Closing Balance|Total VAT", ln, re.I):
         continue
         
      # FNB transactions start with date in format "DD MMM" or have table structure
      if re.match(r"\d{1,2}\s+[A-Za-z]{3}|Date\s+\|", ln):
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
   
   for line in lines:
      # Skip lines that are clearly not transactions
      if not line or "Description" in line or "Date\s+\|" in line:
         continue
         
      # FNB format is either pipe-delimited table or space-separated
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
         match = re.match(r"(\d{1,2}\s+[A-Za-z]{3})\s+(.+?)\s+(-?\s?\d[\d,]*\.\d{2})\s+(-?\s?\d[\d,]*\.\d{2})?", line)
         if not match:
               continue
         date_part, desc, amount_part, balance_part = match.groups()
      
      if not amount_part:
         continue
         
      # Parse date (FNB uses format like "01 Aug")
      try:
         # Add year from statement period
         date_str = f"{date_part} {statement_year}"
         date_obj = datetime.strptime(date_str, "%d %b %Y")
         date_iso = date_obj.strftime("%Y-%m-%d")
      except:
         continue
         
      # Parse amount (remove spaces between - and number, handle Cr suffix)
      amount_part = amount_part.replace(" ", "")
      if "Cr" in amount_part:
         amount_part = amount_part.replace("Cr", "")
         is_credit = True
      else:
         is_credit = False
         
      try:
         amount = float(amount_part.replace(',', ''))
         desc_part = desc.strip()
         if is_credit:
            direction = "in"
            amount_signed = amount
         elif "Purchase" in desc_part or "Payment" in desc_part:
            direction = "out"
            amount_signed = -abs(amount)  
         else:
            direction = "out"
            amount_signed = -abs(amount)
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