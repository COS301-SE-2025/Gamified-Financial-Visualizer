from .preprocessing import normalize_description, keyword_match_category
from transformers import DistilBertForSequenceClassification, DistilBertTokenizerFast
import json, torch, pathlib
from transformers import AutoTokenizer, AutoModelForSequenceClassification

from pathlib import Path
# ---------- Load model & tokenizer ----------
model_path = pathlib.Path("model")

try:
   tokenizer = AutoTokenizer.from_pretrained(model_path)
   model = AutoModelForSequenceClassification.from_pretrained(model_path).eval()
except OSError:
   tokenizer = AutoTokenizer.from_pretrained("CodeBlooded-capstone/fin-classifier", token=True)
   model = AutoModelForSequenceClassification.from_pretrained("CodeBlooded-capstone/fin-classifier", token=True).eval()
   
device    = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)


BASE_DIR = Path(__file__).resolve().parent.parent.parent  # goes up from `services/`
DATA_PATH = BASE_DIR / "classifier/data" / "categories.json"
MODEL_DIR = BASE_DIR / "classifier/model" / "categories.json"
DATA_DIR = BASE_DIR / "data" 

# ---------- Load internal keyword map ----------
with open(DATA_PATH) as f:
   keyword_map = json.load(f)

with open(MODEL_DIR) as f:
    categories_keywords = json.load(f)

cat2id = {c: i for i, c in enumerate(categories_keywords)}
id2cat = {i: c for c, i in cat2id.items()}

# ---------- Batch inference function ----------
def classify_batch(texts: list[str], batch_size: int = 32) -> list[dict]:
   results, model_inputs, fallback_idx = [], [], []

    # Pass 1 ─ keyword match
   for idx, txt in enumerate(texts):
      clean = normalize_description(txt)
      match = keyword_match_category(clean, keyword_map)
      if match:
         results.append({"category": match, "source": "keyword"})
      else:
         results.append(None)               # placeholder
         model_inputs.append(clean)
         fallback_idx.append(idx)

    # Pass 2 ─ model fallback, in true batches
   for start in range(0, len(model_inputs), batch_size):
      batch = model_inputs[start:start+batch_size]
      tok   = tokenizer(batch, return_tensors="pt",
                        padding=True, truncation=True).to(device)

      with torch.no_grad():
         preds = torch.argmax(model(**tok).logits, dim=1).tolist()

      for off, pred in enumerate(preds):
         real_idx = fallback_idx[start + off]
         results[real_idx] = {
               "category": id2cat[pred],
               "source":   "model"
         }
   return results

# ---------- JSON file processor ----------
def classify_transactions_file(inp="./transactions.json",
                               out="../model/classified_transactions.json"):
   with open(inp) as f:
      txns = json.load(f)

   descs     = [tx["description"] for tx in txns]
   predicted = classify_batch(descs)

   for tx, pred in zip(txns, predicted):
      tx["predicted_category"]  = pred["category"]
      tx["classification_source"] = pred["source"]

   with open(out, "w") as f:
      json.dump(txns, f, indent=2)

   print(f"✅ Saved classified transactions → {out}")

# ---------- CLI ----------
if __name__ == "__main__":
   classify_transactions_file()