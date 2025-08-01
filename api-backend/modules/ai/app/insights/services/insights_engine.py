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

   # 2. Apply rule-based logic
   sentiment = get_sentiment(features)
   insights = generate_insight_blocks(features)
   tips = generate_tips(features)

   # 3. Generate narrative summary
   summary_text = generate_summary_text(features, sentiment)

   return {
      "sentiment": sentiment,
      "summaryText": summary_text,
      "insights": insights,
      "tips": tips
   }
