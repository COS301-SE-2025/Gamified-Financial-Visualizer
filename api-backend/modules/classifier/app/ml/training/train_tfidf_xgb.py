# ml/training/train_tfidf_xgb.py
import pandas as pd, joblib, xgboost as xgb
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import classification_report
from preprocess import basic_clean

df = pd.read_csv("ml/data/labelled_transactions.csv")   # cols: description, category
X, y = df.description.map(basic_clean), df.category

pipe = make_pipeline(
    TfidfVectorizer(ngram_range=(1,2), min_df=3, stop_words="english"),
    xgb.XGBClassifier(
        max_depth=6, n_estimators=400, learning_rate=0.1,
        subsample=0.8, colsample_bytree=0.8
    )
)
pipe.fit(X, y)
print(classification_report(y, pipe.predict(X)))

joblib.dump(pipe, "ml/models/tfidf_xgb.joblib")
