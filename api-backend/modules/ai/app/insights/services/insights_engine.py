import pickle
import numpy as np
from app.insights.services.feature_extractors import extract_features
from app.insights.services.insight_rules import (
    get_sentiment,
    generate_insight_blocks,
    generate_tips
)
from app.insights.services.summary_generator import generate_summary_text

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

   return {
      "sentiment": sentiment,
      "summaryText": summary_text,
      "cluster": cluster_id,
      "clusterLabel": cluster_label,
      "insights": insights,
      "tips": tips
   }



def load_cluster_model():
    with open("services/insights/ml/cluster_model.pkl", "rb") as f:
        kmeans, scaler = pickle.load(f)
    return kmeans, scaler

def get_user_cluster(features):
   # 1. Define your mapping
   CLUSTER_LABELS = {
      0: "The Spender",
      1: "The Saver",
      2: "The Balanced",
      3: "The Avoidant"
   }

   vector = np.array([
      features["savings_rate"],
      features["burn_rate"],
      features["goal_completion_ratio"],
      features["impulse_score"],
      features["budget_efficiency"]["average"],
      features.get("volatility_score", 0.0)
   ]).reshape(1, -1)

   kmeans, scaler = load_cluster_model()
   cluster_id = kmeans.predict(scaler.transform(vector))[0]
   cluster_label = CLUSTER_LABELS.get(cluster_id, f"Cluster {cluster_id}")
   return cluster_id, cluster_label
