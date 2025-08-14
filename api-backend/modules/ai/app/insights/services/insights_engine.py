import pickle
import numpy as np
import pandas as pd
from app.insights.services.feature_extractors import extract_features
from app.insights.services.insight_rules import (
    get_sentiment,
    generate_insight_blocks,
    generate_tips
)
from app.insights.services.summary_generator import generate_summary_text

def convert_numpy_types(obj):
   if isinstance(obj, np.integer):
      return int(obj)
   elif isinstance(obj, np.floating):
      return float(obj)
   elif isinstance(obj, np.ndarray):
      return obj.tolist()
   elif isinstance(obj, dict):
      return {k: convert_numpy_types(v) for k, v in obj.items()}
   elif isinstance(obj, list):
      return [convert_numpy_types(i) for i in obj]
   return obj

def generate_wrapped_insights(user_data):
   # 1. Extract behavior features
   features = extract_features(user_data)
 
   # get both the numeric ID and human label
   cluster_id, cluster_label = get_user_cluster(features)

   # 2. Apply rule-based logic
   sentiment = get_sentiment(features)
   insights = generate_insight_blocks(features)
   tips = generate_tips(features)

   # 3. Generate narrative summary
   summary_text = generate_summary_text(features, sentiment)

   return convert_numpy_types({
      "sentiment": sentiment,
      "summaryText": summary_text,
      "cluster": cluster_id,
      "clusterLabel": cluster_label,
      "insights": insights,
      "tips": tips
   })



def load_cluster_model():
    with open("app/insights/ml/cluster_model.pkl", "rb") as f:
        kmeans, scaler = pickle.load(f)
    return kmeans, scaler

def get_user_cluster(features):
   CLUSTER_LABELS = {
      0: "The Spender",
      1: "The Saver",
      2: "The Balanced",
      3: "The Avoidant"
   }

   feature_names = [
      "savings_rate",
      "burn_rate",
      "goal_completion_ratio",
      "impulse_score",
      "budget_efficiency",
      "volatility_score"
   ]

   vector = [
      features["savings_rate"],
      features["burn_rate"],
      features["goal_completion_ratio"],
      features["impulse_score"],
      features["budget_efficiency"]["average"],
      features.get("volatility_score", 0.0)
   ]

   vector_df = pd.DataFrame([vector], columns=feature_names)

   kmeans, scaler = load_cluster_model()
   cluster_id = kmeans.predict(scaler.transform(vector_df))[0]
   cluster_label = CLUSTER_LABELS.get(cluster_id, f"Cluster {cluster_id}")
   return cluster_id, cluster_label
