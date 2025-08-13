import pytest
from datetime import datetime, timedelta
from datetime import datetime, timedelta
from ..insights.services.feature_extractors import extract_features
from ..insights.services.insight_rules import get_sentiment, generate_insight_blocks, generate_tips
from ..insights.services.summary_generator import generate_summary_text
from ..insights.services.insights_engine import (
    category_level_trends, global_trend, category_shift,
    behavioral_tags, spending_forecast, detect_anomalies,
    volatility_by_month, run_trend_analysis
)

def make_tx(date, amount, type_, category="General"):
    return {
        "date": date.isoformat(),
        "amount": amount,
        "transaction_type": type_,
        "category": category
    }

def test_basic_feature_extraction():
    today = datetime.today()
    tx = [
        make_tx(today, 5000, "income"),
        make_tx(today, 2000, "expense", "Food"),
        make_tx(today, 100, "expense", "Snacks"),  # impulse
        make_tx(today, 50, "expense", "Snacks"),   # impulse
    ]
    goals = [
        {"status": "completed"},
        {"status": "in_progress"},
    ]
    budgets = [
        {"category": "Food", "amount": 2500},
        {"category": "Snacks", "amount": 300},
    ]

    features = extract_features({
        "transactions": tx,
        "goals": goals,
        "budgets": budgets
    })

    assert features["savings_rate"] == pytest.approx(0.2)
    assert features["burn_rate"] == pytest.approx(71.7, abs=0.1)
    assert features["impulse_score"] == 0.2
    assert features["goal_completion_ratio"] == 0.5
    assert features["budget_efficiency"]["average"] > 0
    assert features["volatility_score"] >= 0
    assert features["top_category"]["name"] == "Food"

def test_no_income():
    features = extract_features({
        "transactions": [{"date": "2025-08-01", "amount": 1000, "transaction_type": "expense"}],
        "goals": [],
        "budgets": []
    })
    assert features["savings_rate"] == 0
    assert features["burn_rate"] == pytest.approx(33.3, abs=0.1)

def test_empty_data():
    features = extract_features({})
    assert features["savings_rate"] == 0
    assert features["burn_rate"] == pytest.approx(0.0)
    assert features["impulse_score"] == 0.0
    assert features["goal_completion_ratio"] == 0.0
    assert features["budget_efficiency"]["average"] == 0
    assert features["volatility_score"] == 0.0
    assert features["top_category"] is None

def make_tx(date, amount, type_, category="General"):
    return {
        "date": date.isoformat(),
        "amount": amount,
        "transaction_type": type_,
        "category": category
    }

@pytest.fixture
def sample_transactions():
    today = datetime.today()
    return [
        make_tx(today - timedelta(days=60), 1000, "expense", "Food"),
        make_tx(today - timedelta(days=30), 2000, "expense", "Transport"),
        make_tx(today, 3000, "expense", "Food"),
        make_tx(today, 50, "expense", "Snacks"),  # impulse
        make_tx(today, 5000, "income", "Salary"),
    ]

# --- CATEGORY TRENDS ------------------------------------------------------

def test_category_level_trends(sample_transactions):
    trends = category_level_trends(sample_transactions)
    assert isinstance(trends, dict)
    assert len(trends) >= 1
    for month, cats in trends.items():
        assert isinstance(cats, dict)
        assert all(isinstance(v, float) for v in cats.values())

# --- GLOBAL TREND ---------------------------------------------------------

def test_global_trend(sample_transactions):
    trend = global_trend(sample_transactions)
    assert set(trend.keys()) == {"months", "spending", "delta"}
    assert len(trend["months"]) == len(trend["spending"])
    assert len(trend["delta"]) == len(trend["spending"])

# --- CATEGORY SHIFT -------------------------------------------------------

def test_category_shift(sample_transactions):
    shift = category_shift(sample_transactions)
    assert set(shift.keys()) == {"previous", "current", "changed"}
    assert isinstance(shift["changed"], bool)

# --- BEHAVIORAL TAGS ------------------------------------------------------

def test_behavioral_tags(sample_transactions):
    tags = behavioral_tags(sample_transactions)
    assert isinstance(tags, list)
    assert all(isinstance(tag, str) for tag in tags)

# --- SPENDING FORECAST ----------------------------------------------------

def test_spending_forecast(sample_transactions):
    forecast = spending_forecast(sample_transactions)
    assert "next_month_forecast" in forecast
    assert isinstance(forecast["next_month_forecast"], float)

# --- ANOMALY DETECTION ----------------------------------------------------

def test_detect_anomalies(sample_transactions):
    anomalies = detect_anomalies(sample_transactions)
    assert isinstance(anomalies, list)
    for a in anomalies:
        assert set(a.keys()) == {"month", "amount", "category"}

# --- VOLATILITY -----------------------------------------------------------

def test_volatility_by_month(sample_transactions):
    vol = volatility_by_month(sample_transactions)
    assert isinstance(vol, dict)
    assert all(isinstance(v, float) for v in vol.values())

# --- MASTER WRAPPER -------------------------------------------------------

def test_run_trend_analysis(sample_transactions):
    result = run_trend_analysis({"transactions": sample_transactions})
    assert set(result.keys()) == {
        "categoryTrends", "globalTrend", "categoryShift",
        "behavioralTags", "spendingForecast", "anomalies", "volatility"
    }