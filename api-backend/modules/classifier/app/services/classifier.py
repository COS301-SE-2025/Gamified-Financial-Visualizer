from pathlib import Path
import json, torch
from datasets import Dataset
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
    TrainingArguments,
    Trainer,
)

# ---------- 1. Load labels & raw rows ----------
with open("./data/categories.json") as f:
    categories = json.load(f)

cat2id = {c: i for i, c in enumerate(categories)}
id2cat = {i: c for c, i in cat2id.items()}

with open("./transactions.json") as f:
    raw = json.load(f)

rows   = [r for r in raw if r.get("category") in cat2id]
texts  = [r["description"] for r in rows]
labels = [cat2id[r["category"]] for r in rows]

# ---------- 2. Build HF Dataset ----------
# Build DatasetDict first
dataset = Dataset.from_dict({"text": texts, "label": labels}) \
                 .train_test_split(test_size=0.1, seed=42)

tok = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")

mini_ds = Dataset.from_dict({"text": ["Test line one", "Second line"], "label": [0, 1]})

def tok_fn(batch):
    enc = tok(batch["text"], padding="max_length", truncation=True)
    print("DEBUG - keys returned by tok_fn :", enc.keys())      # <-- add
    # convert to plain lists
    return {"input_ids": enc["input_ids"], "attention_mask": enc["attention_mask"]}

mini_ds = mini_ds.map(tok_fn, batched=True)
print("Columns after map:        ", mini_ds.column_names)

# 1. apply to every split at once
dataset = dataset.map(tok_fn, batched=True, remove_columns=["text"])

# 2. set tensor format once (applies to both 'train' and 'test')
dataset.set_format(type="torch",columns=["input_ids", "attention_mask", "label"])
print(type(tok_fn({"text": ["hello"]})["input_ids"]))  # <class 'list'>

print(dataset["train"].column_names)  # ['input_ids', 'attention_mask', 'label']
print(dataset["test"].column_names)   # ['input_ids', 'attention_mask', 'label']

# ---------- 3. Model ----------
model = DistilBertForSequenceClassification.from_pretrained(
   "distilbert-base-uncased",
   num_labels=len(cat2id)
)

# ---------- 4. Train ----------
args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=3,
    per_device_train_batch_size=8,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    logging_steps=50,
)

trainer = Trainer(
   model=model,
   args=args,
   train_dataset=dataset["train"],
   eval_dataset=dataset["test"],
   tokenizer=tok,
)
trainer.train()

model.save_pretrained("./model")
tok.save_pretrained("./model")

# ---------- 5. Inference helper ----------
model.eval()

def classify_transaction(text: str) -> str:
   with torch.no_grad():
      tokens = tok(text, return_tensors="pt")
      logits = model(**tokens).logits
      pred   = int(torch.argmax(logits, dim=1))
   return id2cat[pred]

for tx in raw[:5]:
   cat = classify_transaction(tx["description"])
   print(f"{tx['description'][:40]:40} → {cat}")