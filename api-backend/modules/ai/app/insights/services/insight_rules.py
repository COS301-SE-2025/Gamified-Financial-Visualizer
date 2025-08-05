def get_sentiment(features):
   if features["savings_rate"] < 0.05 and features["impulse_score"] > 0.6:
      return "Anxious"
   if features["goal_completion_ratio"] > 0.75:
      return "Confident"
   if features["burn_rate"] > 300:
      return "Unstable"
   return "Stable"

def generate_insight_blocks(features):
   return [
      f"Your top category was {features['top_category']['name']} (R{int(features['top_category']['amount'])})." if features['top_category'] else "No major expenses recorded.",
      f"Impulse score: {int(features['impulse_score'] * 100)}%",
      f"Burn rate: R{int(features['burn_rate'])}/day",
      f"Savings rate: {int(features['savings_rate'] * 100)}%",
      f"Goal completion: {int(features['goal_completion_ratio'] * 100)}%"
   ]

def generate_tips(features):
   tips = []
   if features["savings_rate"] < 0.1:
      tips.append("Try to increase your savings rate by reducing small expenses.")
   if features["impulse_score"] > 0.6:
      tips.append("Try a no-spend challenge next weekend.")
   if features["goal_completion_ratio"] < 0.5:
      tips.append("Set smaller goals to maintain progress.")
   if features["budget_efficiency"]["average"] < 70:
      tips.append("Review your budget categories — you might be underestimating costs.")
   return tips
