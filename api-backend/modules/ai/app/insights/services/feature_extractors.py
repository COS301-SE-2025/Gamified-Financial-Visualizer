def extract_features(user_data):
   tx = user_data.get("transactions", [])
   goals = user_data.get("goals", [])
   budgets = user_data.get("budgets", [])

   income = sum(float(t["amount"]) for t in tx if t["transaction_type"] == "income")
   expenses = sum(float(t["amount"]) for t in tx if t["transaction_type"] == "expense")
   savings_rate = (income - expenses) / income if income > 0 else 0
   burn_rate = expenses / 30
   impulse_score = sum(1 for t in tx if t["transaction_type"] == "expense" and float(t["amount"]) < 150) / 10

   goal_completion_ratio = len([g for g in goals if g["status"] == "completed"]) / len(goals) if goals else 0

   budget_efficiency = {
      "average": 76,  # Placeholder
      "variance": 11,
      "under_budget": 3,
      "total": 5
   }

   return {
      "savings_rate": savings_rate,
      "burn_rate": burn_rate,
      "goal_completion_ratio": goal_completion_ratio,
      "impulse_score": min(impulse_score, 1.0),
      "budget_efficiency": budget_efficiency,
      "top_category": find_top_category(tx)
   }

def find_top_category(transactions):
   cat_map = {}
   for tx in transactions:
      if tx["transaction_type"] == "expense":
         cat = tx.get("category", "Uncategorized")
         cat_map[cat] = cat_map.get(cat, 0) + float(tx["amount"])
   if not cat_map:
      return None
   name = max(cat_map, key=cat_map.get)
   return { "name": name, "amount": cat_map[name] }
