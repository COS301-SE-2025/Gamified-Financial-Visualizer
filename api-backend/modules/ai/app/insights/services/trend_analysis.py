
from typing import List, Dict, Any
import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.linear_model import LinearRegression

# --- 1. CATEGORY-LEVEL SPECIFIC TRENDS ---
def category_level_trends(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
   df = pd.DataFrame(transactions)
   df["date"] = pd.to_datetime(df["date"])
   df["month"] = df["date"].dt.to_period("M")

   trends = {}
   for cat in df["category"].unique():
      cat_df = df[(df["category"] == cat) & (df["transaction_type"] == "expense")]
      monthly = cat_df.groupby("month")["amount"].sum().sort_index()
      trends[cat] = monthly.to_dict()

   return trends

# --- 2. GLOBAL SPENDING TREND ---
def global_trend(transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
   df = pd.DataFrame(transactions)
   df["date"] = pd.to_datetime(df["date"])
   df["month"] = df["date"].dt.to_period("M")
   
   monthly_spend = df[df["transaction_type"] == "expense"].groupby("month")["amount"].sum()
   trend = monthly_spend.diff().fillna(0).tolist()
   
   return {
      "months": [str(m) for m in monthly_spend.index],
      "spending": monthly_spend.tolist(),
      "delta": trend
   }

# --- 3. CATEGORY SHIFT ANALYSIS ---
def category_shift(transactions: List[Dict[str, Any]]) -> Dict[str, str]:
   df = pd.DataFrame(transactions)
   df["date"] = pd.to_datetime(df["date"])
   df["month"] = df["date"].dt.to_period("M")

   shifts = {}
   recent_months = sorted(df["month"].unique())[-2:]
   if len(recent_months) < 2:
      return {}

   for m in recent_months:
      monthly = df[(df["month"] == m) & (df["transaction_type"] == "expense")]
      top_cat = monthly.groupby("category")["amount"].sum().idxmax()
      shifts[str(m)] = top_cat

   return {
      "previous": shifts.get(str(recent_months[0]), ""),
      "current": shifts.get(str(recent_months[1]), ""),
      "changed": shifts.get(str(recent_months[0]), "") != shifts.get(str(recent_months[1]), "")
   }

# --- 4. BEHAVIORAL ANALYSIS ---
def behavioral_tags(transactions: List[Dict[str, Any]]) -> List[str]:
   df = pd.DataFrame(transactions)
   tags = []
   
   total_tx = len(df)
   impulse_tx = len(df[(df["transaction_type"] == "expense") & (df["amount"] < 100)])
   if impulse_tx / total_tx > 0.3:
      tags.append("Impulsive Spender")

   if df["amount"].mean() > 2000:
      tags.append("High Roller")

   if df[df["transaction_type"] == "expense"].sum()["amount"] < 500:
      tags.append("Frugal")

   return tags

# --- 5. SPENDING FORECAST (Linear Regression) ---
def spending_forecast(transactions: List[Dict[str, Any]]) -> Dict[str, float]:
   df = pd.DataFrame(transactions)
   df["date"] = pd.to_datetime(df["date"])
   df["month"] = df["date"].dt.to_period("M").dt.to_timestamp()

   monthly = df[df["transaction_type"] == "expense"].groupby("month")["amount"].sum().reset_index()
   monthly["month_num"] = np.arange(len(monthly))

   if len(monthly) < 2:
      return {"next_month_forecast": 0.0}

   model = LinearRegression()
   model.fit(monthly[["month_num"]], monthly["amount"])
   next_month = len(monthly)
   forecast = model.predict([[next_month]])[0]

   return {"next_month_forecast": round(float(forecast), 2)}

# --- 6. ANOMALY DETECTION (IQR) ---
def detect_anomalies(transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
   df = pd.DataFrame(transactions)
   q1 = df["amount"].quantile(0.25)
   q3 = df["amount"].quantile(0.75)
   iqr = q3 - q1
   outliers = df[(df["amount"] < q1 - 1.5 * iqr) | (df["amount"] > q3 + 1.5 * iqr)]
   return outliers.to_dict(orient="records")

# --- 7. VOLATILITY ANALYSIS ---
def volatility_by_month(transactions: List[Dict[str, Any]]) -> Dict[str, float]:
   df = pd.DataFrame(transactions)
   df["date"] = pd.to_datetime(df["date"])
   df["month"] = df["date"].dt.to_period("M")
   
   vol = df[df["transaction_type"] == "expense"].groupby("month")["amount"].std().fillna(0)
   return vol.round(2).to_dict()

# --- MASTER WRAPPER ---
def run_trend_analysis(user_data: Dict[str, Any]) -> Dict[str, Any]:
   transactions = user_data.get("transactions", [])

   return {
      "categoryTrends": category_level_trends(transactions),
      "globalTrend": global_trend(transactions),
      "categoryShift": category_shift(transactions),
      "behavioralTags": behavioral_tags(transactions),
      "spendingForecast": spending_forecast(transactions),
      "anomalies": detect_anomalies(transactions),
      "volatility": volatility_by_month(transactions)
   }
