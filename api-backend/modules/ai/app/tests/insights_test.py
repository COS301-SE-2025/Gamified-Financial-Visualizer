import pytest
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from app.insights.services.feature_extractors import extract_features
from app.insights.services.insight_rules import get_sentiment, generate_insight_blocks, generate_tips
from app.insights.services.summary_generator import generate_summary_text
from unittest.mock import patch, MagicMock
from app.insights.services.insights_engine import (
    generate_wrapped_insights,
    get_user_cluster,
    convert_numpy_types
)
from app.insights.services.trend_analysis import (
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

    expected_savings_rate = (5000 - 2150) / 5000
    assert features["savings_rate"] == pytest.approx(expected_savings_rate)
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




# --- Fixtures -------------------------------------------------------------

@pytest.fixture
def sample_features():
    return {
        "savings_rate": 0.25,
        "burn_rate": 100.0,
        "goal_completion_ratio": 0.5,
        "impulse_score": 0.3,
        "budget_efficiency": {
            "average": 80.0,
            "variance": 10.0,
            "under_budget": 2,
            "total": 3
        },
        "volatility_score": 0.2
    }

@pytest.fixture
def sample_user_data():
    return {
        "transactions": [
            {"date": "2025-08-01", "amount": 100, "transaction_type": "expense", "category": "Food"},
            {"date": "2025-08-02", "amount": 5000, "transaction_type": "income", "category": "Salary"},
        ],
        "goals": [{"status": "completed"}, {"status": "in_progress"}],
        "budgets": [{"category": "Food", "amount": 200}]
    }

# --- convert_numpy_types --------------------------------------------------

def test_convert_numpy_types_handles_numpy_objects():
    obj = {
        "int": np.int32(5),
        "float": np.float64(3.14),
        "array": np.array([1, 2, 3]),
        "nested": {"x": np.int64(7)},
        "list": [np.float32(1.1), np.int32(2)]
    }
    converted = convert_numpy_types(obj)
    assert isinstance(converted["int"], int)
    assert isinstance(converted["float"], float)
    assert isinstance(converted["array"], list)
    assert isinstance(converted["nested"]["x"], int)
    assert isinstance(converted["list"][0], float)

# --- get_user_cluster -----------------------------------------------------

@patch("app.insights.services.insights_engine.load_cluster_model")
def test_get_user_cluster_returns_valid_label(mock_load_model, sample_features):
    mock_kmeans = MagicMock()
    mock_kmeans.predict.return_value = [1]
    mock_scaler = MagicMock()
    mock_scaler.transform.return_value = np.array([[0.25, 100, 0.5, 0.3, 80, 0.2]])

    mock_load_model.return_value = (mock_kmeans, mock_scaler)

    cluster_id, label = get_user_cluster(sample_features)
    assert cluster_id == 1
    assert label == "The Saver"

# --- generate_wrapped_insights --------------------------------------------

@patch("app.insights.services.insights_engine.get_user_cluster")
@patch("app.insights.services.insights_engine.extract_features")
@patch("app.insights.services.insights_engine.get_sentiment")
@patch("app.insights.services.insights_engine.generate_insight_blocks")
@patch("app.insights.services.insights_engine.generate_tips")
@patch("app.insights.services.insights_engine.generate_summary_text")
def test_generate_wrapped_insights_returns_expected_structure(
    mock_summary, mock_tips, mock_blocks, mock_sentiment,
    mock_extract, mock_cluster, sample_user_data
):
    mock_extract.return_value = {
        "savings_rate": 0.2,
        "burn_rate": 120.0,
        "goal_completion_ratio": 0.6,
        "impulse_score": 0.4,
        "budget_efficiency": {"average": 75.0},
        "volatility_score": 0.3
    }
    mock_cluster.return_value = (2, "The Balanced")
    mock_sentiment.return_value = "neutral"
    mock_blocks.return_value = [{"title": "Insight", "value": "You’re doing well"}]
    mock_tips.return_value = ["Try saving more"]
    mock_summary.return_value = "Your financial behavior is balanced."

    result = generate_wrapped_insights(sample_user_data)

    assert result["sentiment"] == "neutral"
    assert result["cluster"] == 2
    assert result["clusterLabel"] == "The Balanced"
    assert isinstance(result["summaryText"], str)
    assert isinstance(result["insights"], list)
    assert isinstance(result["tips"], list)


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

# --- 1. CATEGORY TRENDS ---------------------------------------------------

def test_category_level_trends(sample_transactions):
    result = category_level_trends(sample_transactions)
    assert isinstance(result, dict)
    assert all(isinstance(v, dict) for v in result.values())
    assert "Food" in list(result.values())[0]

def test_category_level_trends_empty():
    assert category_level_trends([]) == {}

# --- 2. GLOBAL TREND ------------------------------------------------------

def test_global_trend(sample_transactions):
    result = global_trend(sample_transactions)
    assert set(result.keys()) == {"months", "spending", "delta"}
    assert len(result["months"]) == len(result["spending"]) == len(result["delta"])

def test_global_trend_empty():
    assert global_trend([]) == {"months": [], "spending": [], "delta": []}

# --- 3. CATEGORY SHIFT ----------------------------------------------------

def test_category_shift(sample_transactions):
    result = category_shift(sample_transactions)
    assert set(result.keys()) == {"previous", "current", "changed"}
    assert isinstance(result["changed"], bool)

def test_category_shift_empty():
    assert category_shift([]) == {"previous": "", "current": "", "changed": False}

# --- 4. BEHAVIORAL TAGS ---------------------------------------------------

def test_behavioral_tags(sample_transactions):
    tags = behavioral_tags(sample_transactions)
    assert isinstance(tags, list)
    assert all(isinstance(tag, str) for tag in tags)

def test_behavioral_tags_empty():
    assert behavioral_tags([]) == []

# --- 5. SPENDING FORECAST -------------------------------------------------

def test_spending_forecast(sample_transactions):
    result = spending_forecast(sample_transactions)
    assert "next_month_forecast" in result
    assert isinstance(result["next_month_forecast"], float)

def test_spending_forecast_empty():
    assert spending_forecast([]) == {"next_month_forecast": 0.0}

# --- 6. ANOMALY DETECTION -------------------------------------------------

def test_detect_anomalies(sample_transactions):
    result = detect_anomalies(sample_transactions)
    assert isinstance(result, list)
    for item in result:
        assert set(item.keys()) == {"month", "amount", "category"}

def test_detect_anomalies_empty():
    assert detect_anomalies([]) == []

# --- 7. VOLATILITY --------------------------------------------------------

def test_volatility_by_month(sample_transactions):
    result = volatility_by_month(sample_transactions)
    assert isinstance(result, dict)
    assert all(isinstance(v, float) for v in result.values())

def test_volatility_by_month_empty():
    assert volatility_by_month([]) == {}

# --- MASTER WRAPPER -------------------------------------------------------

def test_run_trend_analysis(sample_transactions):
    result = run_trend_analysis({"transactions": sample_transactions})
    assert set(result.keys()) == {
        "categoryTrends", "globalTrend", "categoryShift",
        "behavioralTags", "spendingForecast", "anomalies", "volatility"
    }