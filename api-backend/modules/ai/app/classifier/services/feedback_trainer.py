# api-backend/modules/ai/app/classifier/services/feedback_trainer.py
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
import os

db2model = {
   'groceries':               'Groceries',
   'transport':               'Transport',
   'fuel':                    'Transport',
   'utilities':               'Utilities',
   'rent':                    'Rent & Mortgage',
   'mortgage':                'Rent & Mortgage',
   'internet':                'Utilities',
   'phone':                   'Utilities',
   'insurance':               'Insurance',
   'medical':                 'Medical & Health',
   'health':                  'Medical & Health',
   'fitness':                 'Fitness',
   'subscriptions':           'Subscriptions',
   'entertainment':           'Entertainment',
   'restaurants':             'Restaurants',
   'clothing':                'Clothing',
   'personal care':           'Personal Care',
   'gifts':                   'Gifts & Charity',
   'charity':                 'Gifts & Charity',
   'taxes':                   'Taxes',
   'savings':                 'Savings & Investments',
   'investments':             'Savings & Investments',
   'loan repayment':          'Loan Repayment & Debt',
   'debt':                    'Loan Repayment & Debt',
   'travel':                  'Travel & Accommodation',
   'accommodation':           'Travel & Accommodation',
   'salary':                  'Salary',
   'freelance':               'Business Income & Expenses',
   'bonus':                   'Business Income & Expenses',
   'refund':                  'Business Income & Expenses',
   'business income':         'Business Income & Expenses',
   'business expense':        'Business Income & Expenses',
   'transfer in':             'Wallet Transactions',
   'transfer out':            'Wallet Transactions',
   'cash withdrawal':         'Wallet Transactions',
   'cash deposit':            'Wallet Transactions',
   'wallet top-up':           'Wallet Transactions',
   'wallet withdrawal':       'Wallet Transactions',
   'maintenance':             'Home Improvement & Repairs',
   'repairs':                 'Home Improvement & Repairs',
   'home improvement':        'Home Improvement & Repairs',
   'childcare':               'Childcare & Pets',
   'pets':                    'Childcare & Pets',
   'crypto purchase':         'Crypto & Forex',
   'crypto sale':             'Crypto & Forex',
   'forex':                   'Crypto & Forex',
   'fees':                    'Fees',
   'commissions':             'Fees',
   'interest income':         'Fees',
   'dividends':               'Fees'
}

def main(feedbacks: list[dict] = None):
   base_dir      = Path(__file__).resolve().parent.parent.parent
   model_dir     = base_dir / "classifier/services/model"
   labels_path   = base_dir / "classifier/data" / "categories.json"
   feedback_path = base_dir / "classifier/data" / "feedback_corrected.json"
   print(f"Model directory: {model_dir}")
   # 1) Load label map
   categories = json.loads((labels_path).read_text())
   cat2id     = {c:i for i,c in enumerate(categories)}
   cat2id_lower = {c.lower(): idx for c, idx in cat2id.items()}
   
   # 2) Read & merge existing feedback
   all_fb = []
   if feedback_path.exists():
      all_fb = json.loads(feedback_path.read_text())
   # If called with a list, extend and persist
   if feedbacks:
      all_fb.extend(feedbacks)
      feedback_path.write_text(json.dumps(all_fb, indent=2))
      print(f"Appended {len(feedbacks)} new feedbacks")
      print(f"Appended {(feedbacks)}")

   # 3) Build a small Dataset only from feedback
   texts  = [ f"{r['desc']}".lower()
            for r in all_fb ]
   
   labels = []
   for r in all_fb:
      key = r['corrected_category']
      # try exact match first, then lowercase
      if key in cat2id:
         labels.append(cat2id[key])
      elif key.lower() in cat2id_lower:
         labels.append(cat2id_lower[key.lower()])
      else:
         print(f"Warning: Category '{key}' not found in label map")
         # Map with bd2model
         if key in db2model:
            labels.append(cat2id[db2model[key]])
         else:
            print(f"Warning: Category '{key}' not found in db2model mapping")
            labels.append(cat2id['miscellaneous'])


   print(f"Training on {len(texts)} feedback items")
   
   ds = Dataset.from_dict({"text": texts, "label": labels})
   if len(ds) < 2:
      print("Not enough feedback to train")
      return

   ds = ds.train_test_split(test_size=0.2, seed=42)

   print(f"Feedback split into {len(ds['train'])} train and {len(ds['test'])} test samples")

   # 4) Tokenize
   tok = DistilBertTokenizerFast.from_pretrained(model_dir)
   def tok_fn(batch):
      enc = tok(batch["text"], padding="max_length", truncation=True, max_length=128)
      return {"input_ids": enc["input_ids"], "attention_mask": enc["attention_mask"]}
   
   print("Tokenizing feedback dataset...") # this is fine now

   ds = ds.map(tok_fn, batched=True)
   ds = ds.remove_columns("text")
   ds.set_format(type="torch",columns=["input_ids","attention_mask","label"])

   print("Tokenization complete") 
   print(model_dir)
   # 5) Load & fine-tune - fails from here
   try:
      model = DistilBertForSequenceClassification.from_pretrained(
         str(model_dir)
      )
   except Exception as e:
      print("❌ failed to load model:", e)
      raise

   device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
   model.to(device)

   print("Starting feedback training...")
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

   try:
      print("Training feedback model...")
      trainer.train()
   except Exception as e:
      print("❌ Training failed:", e)
      raise


   print("Feedback training complete, evaluating...")
   # 6) Save & optionally push to HF
   model.save_pretrained(model_dir)
   tok.save_pretrained(model_dir)
   print("Feedback training complete")

   # push up to Hugging Face
   HF_REPO = "CodeBlooded-capstone/fin-classifier" 
   hf_token = os.getenv("HF_TOKEN")
   print(hf_token)

   # Create repo if it doesn't exist
   HfApi().create_repo(repo_id=HF_REPO, exist_ok=True)

   # Push both model and tokenizer
   model.push_to_hub(HF_REPO, token=hf_token)
   tok.push_to_hub(HF_REPO, token=hf_token)

   # push up to Hugging Face
   from huggingface_hub import upload_folder
   upload_folder(
      repo_id=HF_REPO,
      folder_path=model_dir,
      token=hf_token,
      repo_type="model"
   )


if __name__ == "__main__":
   main()