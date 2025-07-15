# api-backend/modules/classifier/app/services/feedback_trainer.py
import json
from pathlib import Path
from datasets import Dataset
import torch
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
    TrainingArguments,
    Trainer,
)
from huggingface_hub import HfApi

def main(feedbacks: list[dict] = None):
   base_dir      = Path(__file__).resolve().parent.parent.parent
   model_dir     = base_dir / "model"
   labels_path   = base_dir / "app/model" / "categories.json"
   feedback_path = base_dir / "app/data" / "feedback_corrected.json"
   hf_repo       = "CodeBlooded-capstone/fin-classifier"

   # 1) Load label map
   categories = json.loads((labels_path).read_text())
   cat2id     = {c:i for i,c in enumerate(categories)}

   # 2) Read & merge existing feedback
   all_fb = []
   if feedback_path.exists():
      all_fb = json.loads(feedback_path.read_text())
   # If called with a list, extend and persist
   if feedbacks:
      all_fb.extend(feedbacks)
      feedback_path.write_text(json.dumps(all_fb, indent=2))
      print(f"Appended {len(feedbacks)} new feedbacks")

   # 3) Build a small Dataset only from feedback
   texts  = [ f"{r['description']} {r['amount']} {r['direction']}".lower()
            for r in all_fb ]
   labels = [ cat2id[r['corrected_category']] for r in all_fb ]

   ds = Dataset.from_dict({"text": texts, "label": labels})
   if len(ds) < 2:
      print("Not enough feedback to train")
      return

   ds = ds.train_test_split(test_size=0.2, seed=42)

   # 4) Tokenize
   tok = DistilBertTokenizerFast.from_pretrained(model_dir)
   def tok_fn(batch):
      enc = tok(batch["text"], padding="max_length", truncation=True, max_length=128)
      return {"input_ids": enc["input_ids"], "attention_mask": enc["attention_mask"]}
   
   ds = ds.map(tok_fn, batched=True)
   ds = ds.remove_columns("text")
   ds.set_format(type="torch",columns=["input_ids","attention_mask","label"])

   # 5) Load & fine-tune
   model = DistilBertForSequenceClassification.from_pretrained(
      model_dir, num_labels=len(cat2id)
   )
   device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
   model.to(device)

   args = TrainingArguments(
      output_dir="./results-feedback",
      num_train_epochs=3,
      per_device_train_batch_size=8,
      save_strategy="no",
      logging_steps=20,
   )
   trainer = Trainer(
      model=model,
      args=args,
      train_dataset=ds["train"],
      eval_dataset=ds["test"],
      tokenizer=tok,
   )

   trainer.train()

   # 6) Save & optionally push to HF
   model.save_pretrained(model_dir)
   tok.save_pretrained(model_dir)
   print("Feedback training complete")

   # push up to Hugging Face
   HfApi().push_to_hub(
      repo_id=hf_repo,
      repo_type="model",
      path=str(model_dir),
      token=True
   )

if __name__ == "__main__":
   main()