import json
from pathlib import Path
import torch
from datasets import Dataset
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
    TrainingArguments,
    Trainer,
)

def main():
   # ---------- 1. Paths & Category Map ----------
   MODEL_DIR = Path("model")
   FEEDBACK_PATH = MODEL_DIR / "feedback_corrected.json"
   LABELS_PATH = MODEL_DIR / "categories.json"

   with open(LABELS_PATH) as f:
      categories = json.load(f)

   cat2id = {c: i for i, c in enumerate(categories)}
   id2cat = {i: c for c, i in cat2id.items()}

   # ---------- 2. Load Feedback Data ----------
   with open(FEEDBACK_PATH) as f:
      feedback = json.load(f)

   texts = [f"{r['description']} {r['amount']} {r['direction']}".lower() for r in feedback]
   labels = [cat2id[r['corrected_category']] for r in feedback]

   dataset = Dataset.from_dict({"text": texts, "label": labels})
   dataset = dataset.train_test_split(test_size=0.2, seed=42)

   # ---------- 3. Tokenization ----------
   tokenizer = DistilBertTokenizerFast.from_pretrained(MODEL_DIR)

   def tokenize(batch):
      tokens = tokenizer(batch["text"], padding="max_length", truncation=True, max_length=128)
      return {"input_ids": tokens["input_ids"], "attention_mask": tokens["attention_mask"]}

   dataset = dataset.map(tokenize, batched=True)
   dataset = dataset.remove_columns("text")
   dataset.set_format(type="torch", columns=["input_ids", "attention_mask", "label"])

   # ---------- 4. Load Model ----------
   model = DistilBertForSequenceClassification.from_pretrained(MODEL_DIR, num_labels=len(cat2id))

   # ---------- 5. Fine-Tune ----------
   args = TrainingArguments(
      output_dir="./results-feedback",
      num_train_epochs=3,
      per_device_train_batch_size=8,
      save_strategy="no",  # don't checkpoint every epoch
      logging_steps=20,
   )

   trainer = Trainer(
      model=model,
      args=args,
      train_dataset=dataset["train"],
      eval_dataset=dataset["test"],
      tokenizer=tokenizer,
   )

   trainer.train()

   # ---------- 6. Save Model ----------
   model.save_pretrained(MODEL_DIR)
   tokenizer.save_pretrained(MODEL_DIR)

   print("✅ Feedback training complete")

if __name__ == "__main__":
   main()