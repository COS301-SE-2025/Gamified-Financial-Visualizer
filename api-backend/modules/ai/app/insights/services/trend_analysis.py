from typing import List, Dict, Any
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# --- helpers ---------------------------------------------------------------

def _df_from_tx(transactions: List[Dict[str, Any]]) -> pd.DataFrame:
   if not transactions:
      return pd.DataFrame(columns=["date","amount","transaction_type","category"])

   df = pd.DataFrame(transactions).copy()
   # expected keys: date, amount, transaction_type, category
   df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(0.0)

   # parse ISO strings that may end in 'Z' or '+00:00'
   df["date"] = pd.to_datetime(df["date"], errors="coerce", utc=True).dt.tz_convert(None)
   df = df.dropna(subset=["date"])  # drop bad dates if any

   # period for grouping, and presentational month label (Jan, Feb, …)
   df["period"] = df["date"].dt.to_period("M")
   df["month_label"] = df["date"].dt.strftime("%b")
   return df

def _month_labels_sorted(period_index: pd.Index) -> List[str]:
   """Return month short names in chronological order of the given PeriodIndex."""
   if len(period_index) == 0:
      return []
   # convert to timestamp for sorting, then to short name
   ts = pd.Series(period_index.to_timestamp()).sort_values().dt.strftime("%b")
   return ts.tolist()

def _is_income(t: str) -> bool:
   return t in ("income", "deposit", "transfer")

def _is_expense(t: str) -> bool:
    return t in ("expense", "withdrawal", "fee")

# --- 1. CATEGORY-LEVEL SPECIFIC TRENDS ------------------------------------

def category_level_trends(transactions: List[Dict[str, Any]]) -> Dict[str, Dict[str, float]]:
   df = _df_from_tx(transactions)
   if df.empty:
      return {}

   exp = df[df["transaction_type"].map(_is_expense)]
   if exp.empty:
      return {}

   # sum by month x category → wide
   # category_level_trends
   wide = (
      exp.groupby(["period","month_label","category"])["amount"]
         .sum()
         .reset_index()
         .pivot(index=["period","month_label"], columns="category", values="amount")
         .fillna(0.0)
         .sort_index()   
)

   # build { "Jan": {cat: amt, ...}, ... } in chronological order
   out: Dict[str, Dict[str, float]] = {}
   for (period, label), row in wide.iterrows():
      out[label] = {str(cat): float(val) for cat, val in row.items()}
   return out

# --- 2. GLOBAL SPENDING TREND ---------------------------------------------

def global_trend(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
   df = _df_from_tx(transactions)
   if df.empty:
      return {"months": [], "spending": [], "delta": []}

   exp = df[df["transaction_type"].map(_is_expense)]
   monthly = (
      exp.groupby(["period","month_label"])["amount"]
         .sum()
         .reset_index()
         .sort_values("period")
   )
   months = monthly["month_label"].tolist()
   spending = monthly["amount"].round(2).tolist()
   delta = pd.Series(spending).diff().fillna(0).round(2).tolist()
   return {"months": months, "spending": spending, "delta": delta}

# --- 3. CATEGORY SHIFT ANALYSIS -------------------------------------------

def category_shift(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
   df = _df_from_tx(transactions)
   if df.empty:
      return {"previous": "", "current": "", "changed": False}

   exp = df[df["transaction_type"].map(_is_expense)]
   if exp.empty:
      return {"previous": "", "current": "", "changed": False}

   # latest two months by period
   last_two = (
      exp.groupby(["period","month_label","category"])["amount"]
         .sum()
         .reset_index()
         .sort_values("period")
         .groupby(["period","month_label"])
   )
   # take top category per month
   top_per_month = (
      last_two.apply(lambda g: g.loc[g["amount"].idxmax(), "category"])
               .reset_index(name="top_category")
               .sort_values("period")
   )

   if len(top_per_month) < 2:
      return {"previous": "", "current": "", "changed": False}

   prev = top_per_month.iloc[-2]
   curr = top_per_month.iloc[-1]
   return {
      "previous": str(prev["top_category"]),
      "current": str(curr["top_category"]),
      "changed": str(prev["top_category"]) != str(curr["top_category"])
   }

# --- 4. BEHAVIORAL ANALYSIS -----------------------------------------------

def behavioral_tags(transactions: List[Dict[str, Any]]) -> List[str]:
   df = _df_from_tx(transactions)
   if df.empty:
      return []

   tags: List[str] = []

   total_tx = len(df)
   if total_tx > 0:
      impulse_tx = len(df[(_df_from_tx(transactions)["transaction_type"].map(_is_expense)) & (df["amount"] < 100)])
      if impulse_tx / total_tx > 0.3:
         tags.append("Impulsive Spender")

   mean_amt = float(df["amount"].mean() or 0)
   if mean_amt > 2000:
      tags.append("High Roller")

   total_expense = float(df[df["transaction_type"].map(_is_expense)]["amount"].sum() or 0)
   if total_expense < 500:
      tags.append("Frugal")

   return tags

# --- 5. SPENDING FORECAST (Linear Regression) -----------------------------

def spending_forecast(transactions: List[Dict[str, Any]]) -> Dict[str, float]:
   df = _df_from_tx(transactions)
   if df.empty:
      return {"next_month_forecast": 0.0}

   exp = df[df["transaction_type"].map(_is_expense)]
   monthly = (
      exp.groupby("period")["amount"]
         .sum()
         .reset_index()
         .sort_values("period")
   )
   monthly["month_num"] = np.arange(len(monthly), dtype=float)

   if len(monthly) < 2:
      return {"next_month_forecast": float(round(monthly["amount"].iloc[-1], 2)) if len(monthly) else 0.0}

   X = monthly[["month_num"]].values
   y = monthly["amount"].values
   model = LinearRegression()
   model.fit(X, y)
   next_month_num = np.array([[float(len(monthly))]])
   forecast = float(model.predict(next_month_num)[0])
   return {"next_month_forecast": round(forecast, 2)}

# --- 6. ANOMALY DETECTION (IQR on expenses) -------------------------------

def detect_anomalies(transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
   df = _df_from_tx(transactions)
   exp = df[df["transaction_type"].map(_is_expense)]
   if exp.empty:
      return []

   q1 = exp["amount"].quantile(0.25)
   q3 = exp["amount"].quantile(0.75)
   iqr = q3 - q1
   mask = (exp["amount"] < q1 - 1.5 * iqr) | (exp["amount"] > q3 + 1.5 * iqr)
   out = exp.loc[mask, ["date","month_label","category","amount"]].copy()
   out["amount"] = out["amount"].round(2)
   # shape for chart: { month: 'Jan', amount: 1234.56, category: '...' }
   return [
      {"month": r["month_label"], "amount": float(r["amount"]), "category": str(r["category"])}
      for _, r in out.iterrows()
   ]

# --- 7. VOLATILITY ANALYSIS (std by month on expenses) --------------------

def volatility_by_month(transactions: List[Dict[str, Any]]) -> Dict[str, float]:
   df = _df_from_tx(transactions)
   exp = df[df["transaction_type"].map(_is_expense)]
   if exp.empty:
      return {}

   vol = (
      exp.groupby(["period","month_label"])["amount"]
         .std()
         .fillna(0.0)
         .reset_index()
         .sort_values("period")
   )
   return {row["month_label"]: float(round(row["amount"], 2)) for _, row in vol.iterrows()}

# --- MASTER WRAPPER -------------------------------------------------------

def run_trend_analysis(user_data: Dict[str, Any]) -> Dict[str, Any]:
   tx = user_data.get("transactions", []) or []

   return {
      "categoryTrends": category_level_trends(tx),   # { 'Jan': { 'groceries': 123, ...}, ... }
      "globalTrend":    global_trend(tx),            # { months:[...], spending:[...], delta:[...] }
      "categoryShift":  category_shift(tx),          # { previous, current, changed }
      "behavioralTags": behavioral_tags(tx),         # ['Impulsive Spender', ...]
      "spendingForecast": spending_forecast(tx),     # { next_month_forecast: 1234.56 }
      "anomalies":      detect_anomalies(tx),        # [ { month:'Jan', amount: 123, category:'...' }, ... ]
      "volatility":     volatility_by_month(tx)      # { 'Jan': 100.22, ... }
   }
