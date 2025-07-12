from pathlib import Path
import json, torch, re
import pandas as pd
from datasets import Dataset
import evaluate
from transformers import (
    DistilBertTokenizerFast,
    DistilBertForSequenceClassification,
    TrainingArguments,
    Trainer,
)
from huggingface_hub import HfApi

from preprocessing import build_text, normalize_description

# ---------- 1. Internal category schema ----------
with open("../data/categories.json") as f:
    categories = json.load(f)                     # dict: {cat: [keywords]}

sorted_cats = sorted(categories)                  # stable order
cat2id = {c: i for i, c in enumerate(sorted_cats)}
id2cat = {i: c for c, i in cat2id.items()}

with open("../model/categories.json", "w") as f:
    json.dump(list(cat2id.keys()), f, indent=2)


# ---------- 2. Load and map Kaggle dataset ----------
df = pd.read_csv("../data/personal_transactions.csv")

MAP_KAGGLE_TO_INTERNAL = {
    "Alcohol & Bars": "Entertainment",
    "Auto Insurance":  "Insurance",
    "Coffee Shops":    "Food & Dining",
    "Electronics & Software": "Miscellaneous",
    "Entertainment":   "Entertainment",
    "Fast Food":       "Restaurants",
    "Gas & Fuel":      "Transport",
    "Groceries":       "Groceries",
    "Haircut":         "Personal Care",
    "Home Improvement":"Home Improvement & Repairs",
    "Internet":        "Utilities",
    "Mobile Phone":    "Utilities",
    "Mortgage & Rent": "Rent & Mortgage",
    "Movies & DVDs":   "Entertainment",
    "Music":           "Subscriptions",
    "Restaurants":     "Restaurants",
    "Shopping":        "Clothing",
    "Television":      "Subscriptions",
    "Utilities":       "Utilities",
}
df["internal_cat"] = df["Category"].map(MAP_KAGGLE_TO_INTERNAL)
df = df.dropna(subset=["internal_cat"])


# ---------- 3. Build training corpus ----------
def make_text(row):
    txt = build_text(row["Description"], row["Amount"], row["Transaction Type"])
    return normalize_description(txt)

texts  = [make_text(r) for _, r in df.iterrows()]
labels = [cat2id[c]   for c   in df["internal_cat"]]

dataset = Dataset.from_dict({"text": texts, "label": labels}) \
                 .train_test_split(test_size=0.1, seed=42)

# Load feedback
feedback_path = Path("../model/feedback_corrected.json")
if feedback_path.exists():
    with open(feedback_path) as f:
        feedback = json.load(f)

    # Format feedback as training rows
    feedback_texts = [
        f"{r['description']} {r['amount']} {r['direction']}".lower()
        for r in feedback
    ]
    feedback_labels = [cat2id[r["corrected_category"]] for r in feedback]

    # Append to original training lists
    texts.extend(feedback_texts)
    labels.extend(feedback_labels)

    print(f"✅ Included {len(feedback)} user feedback examples in training")

# ---------- 4. Tokenise ----------
tok = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")

def tok_fn(batch):
    enc = tok(batch["text"], padding="max_length",
              truncation=True, max_length=128)
    return {"input_ids": enc["input_ids"],
            "attention_mask": enc["attention_mask"]}

dataset = dataset.map(tok_fn, batched=True)
dataset = dataset.remove_columns("text")
dataset.set_format(type="torch",
                   columns=["input_ids", "attention_mask", "label"])

# ---------- 5. Model ----------
model = DistilBertForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=len(cat2id)
)

# ---------- 6. Training ----------
args = TrainingArguments(
    output_dir="./results",
    num_train_epochs=4,
    per_device_train_batch_size=8,
    save_strategy="epoch",
    logging_steps=50,
    save_steps=500,       # checkpoint every 500 steps
    do_eval=True,         # turn on evaluation
    eval_steps=500,       # run eval every 500 steps
)

metric = evaluate.load("f1")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = logits.argmax(-1)
    return metric.compute(predictions=preds, references=labels, average="macro")

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
    tokenizer=tok,
    compute_metrics=compute_metrics,
)

trainer.train()

# ---------- 7. Save artefacts ----------
model_dir = Path("./model")
model_dir.mkdir(exist_ok=True)
model.save_pretrained(model_dir)
tok.save_pretrained(model_dir)
json.dump(id2cat, model_dir.joinpath("id2cat.json").open("w"))

HF_REPO = "CodeBlooded-capstone/fin-classifier" 

# Create repo if it doesn't exist
HfApi().create_repo(repo_id=HF_REPO, exist_ok=True)

# Push both model and tokenizer
model.push_to_hub(HF_REPO, use_auth_token=True)
tok.push_to_hub(HF_REPO, use_auth_token=True)

from huggingface_hub import upload_file
upload_file(
    path_or_fileobj="../model/categories.json",
    path_in_repo="categories.json",
    repo_id=HF_REPO,
    token=True
)

print("Training complete and model saved.")