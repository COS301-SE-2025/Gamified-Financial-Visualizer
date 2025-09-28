from .preprocessing import normalize_description, keyword_match_category
from transformers import DistilBertForSequenceClassification, DistilBertTokenizerFast
import json, torch, pathlib, os
from transformers import AutoTokenizer, AutoModelForSequenceClassification

from pathlib import Path
# ---------- Globals ----------
model = None
tokenizer = None
model_ready = False
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_model():
   global model, tokenizer, model_ready
   model_ready = False  # reset flag

   print("[Model Loader] Attempting to load model...")

   model_path = pathlib.Path("model")
   device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

   try:
      # Try local model folder first
      tokenizer = AutoTokenizer.from_pretrained(model_path)
      model = AutoModelForSequenceClassification.from_pretrained(model_path).eval()
      print("[Model Loader] Loaded model from local folder.")
   except Exception as local_error:
      print(f"[Model Loader] Local model load failed: {local_error}")
      try:
         # Fallback to Hugging Face Hub
         hf_token = os.getenv("HF_TOKEN", None)
         tokenizer = AutoTokenizer.from_pretrained("CodeBlooded-capstone/fin-classifier", token=hf_token)
         model = AutoModelForSequenceClassification.from_pretrained("CodeBlooded-capstone/fin-classifier", token=hf_token).eval()
         print("[Model Loader] Loaded model from Hugging Face Hub.")
      except Exception as remote_error:
         print(f"[Model Loader] Remote model load failed: {remote_error}")
         return  # model_ready stays False

   model.to(device)
   model_ready = True
   print("[Model Loader] Model is ready.")

def is_model_ready():
   return model_ready

# ---------- Load keyword maps ----------
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_PATH = BASE_DIR / "classifier/data" / "categories.json"
MODEL_DIR = BASE_DIR / "classifier/model" / "categories.json"

with open(DATA_PATH) as f:
    keyword_map = json.load(f)

with open(MODEL_DIR) as f:
    categories_keywords = json.load(f)

cat2id = {c: i for i, c in enumerate(categories_keywords)}
id2cat = {i: c for c, i in cat2id.items()}

# ---------- Batch inference ----------
def classify_batch(texts: list[str], batch_size: int = 32) -> list[dict]:
   if not model_ready:
      raise RuntimeError("Model is not ready. Call load_model() first.")

   results, model_inputs, fallback_idx = [], [], []

   for idx, txt in enumerate(texts):
      clean = normalize_description(txt)
      match = keyword_match_category(clean, keyword_map)
      if match:
         results.append({"category": match, "source": "keyword"})
      else:
         results.append(None)
         model_inputs.append(clean)
         fallback_idx.append(idx)

   for start in range(0, len(model_inputs), batch_size):
      batch = model_inputs[start:start+batch_size]
      tok = tokenizer(batch, return_tensors="pt", padding=True, truncation=True).to(device)

      with torch.no_grad():
         preds = torch.argmax(model(**tok).logits, dim=1).tolist()

      for off, pred in enumerate(preds):
         real_idx = fallback_idx[start + off]
         results[real_idx] = {
               "category": id2cat[pred],
               "source": "model"
         }

   return results

# ---------- CLI utility ----------
def classify_transactions_file(inp="./transactions.json", out="../model/classified_transactions.json"):
   load_model()
   with open(inp) as f:
      txns = json.load(f)

   descs = [tx["description"] for tx in txns]
   predicted = classify_batch(descs)

   for tx, pred in zip(txns, predicted):
      tx["predicted_category"] = pred["category"]
      tx["classification_source"] = pred["source"]

   with open(out, "w") as f:
      json.dump(txns, f, indent=2)

   print(f"✅ Saved classified transactions → {out}")

# ---------- CLI ----------
if __name__ == "__main__":
   classify_transactions_file()