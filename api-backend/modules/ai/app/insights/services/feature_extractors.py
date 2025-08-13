from collections import defaultdict
from statistics import mean, pvariance, stdev
from datetime import datetime

def extract_features(user_data):
   tx = user_data.get("transactions", [])
   goals = user_data.get("goals", [])
   budgets = user_data.get("budgets", [])

   # --- Income & Expenses ---
   income = sum(
      float(t["amount"]) for t in tx if t["transaction_type"] == "income"
   )
   expenses = sum(
      float(t["amount"]) for t in tx if t["transaction_type"] == "expense"
   )
   savings_rate = (income - expenses) / income if income > 0 else 0
   burn_rate = expenses / 30  # average daily spend

   # --- Impulse Purchases ---
   impulse_score = sum(
      1 for t in tx
      if t["transaction_type"] == "expense" and float(t["amount"]) < 150
   ) / 10
   impulse_score = min(impulse_score, 1.0)

   # --- Goal Completion ---
   completed = len([g for g in goals if g.get("status") == "completed"])
   total_goals = len(goals)
   goal_completion_ratio = completed / total_goals if total_goals > 0 else 0

   # --- Budget Efficiency ---
   # budgets: list of { category: str, amount: float }
   # tx: list of transactions with t["category"]
   spent_by_cat = defaultdict(float)
   for t in tx:
      if t["transaction_type"] == "expense":
         spent_by_cat[t.get("category", "Uncategorized")] += float(t["amount"])

   ratios = []
   under = 0
   for b in budgets:
      cat = b["category"]
      limit = float(b["amount"])
      spent = spent_by_cat.get(cat, 0.0)
      ratio = spent / limit if limit > 0 else 0
      ratios.append(ratio * 100)                  # as percentage
      if spent <= limit:
         under += 1

   avg_eff = mean(ratios) if ratios else 0
   var_eff = pvariance(ratios) if len(ratios) > 1 else 0

   budget_efficiency = {
      "average": round(avg_eff, 1),               # e.g. 82.3%
      "variance": round(var_eff, 1),
      "under_budget": under,
      "total": len(ratios)
   }

   # --- Volatility Score ---
   # Compute daily spending totals and take relative stddev
   daily = defaultdict(float)
   for t in tx:
      if t["transaction_type"] == "expense":
         day = datetime.fromisoformat(t["date"]).date()
         daily[day] += float(t["amount"])

   daily_vals = list(daily.values())
   if len(daily_vals) > 1:
      vol_score = stdev(daily_vals) / mean(daily_vals)
   else:
      vol_score = 0.0

   # --- Top Category ---
   top_category = find_top_category(tx)

   return {
      "savings_rate": round(savings_rate, 3),
      "burn_rate": round(burn_rate, 1),
      "impulse_score": round(impulse_score, 2),
      "goal_completion_ratio": round(goal_completion_ratio, 2),
      "budget_efficiency": budget_efficiency,
      "volatility_score": round(vol_score, 2),
      "top_category": top_category
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
