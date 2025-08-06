# api-backend/modules/classifier/app/server.py
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List
import uvicorn
from datetime import datetime

# import your service-layer functions
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from typing import Optional

# ---- Service-layer functions ----
from app.classifier.services.predict_classifier import classify_batch
from app.classifier.services.train_classifier import main as train_model
from app.classifier.services.feedback_trainer import main as train_feedback
from app.insights.services.insights_engine import (
    generate_wrapped_insights,
    fetch_user_data
)

app = FastAPI(title="AI Service")

# --- Classifier API ---
# ---- Request/Response Schemas ----
class PredictReq(BaseModel):
    description: str

class PredictRes(BaseModel):
    category: str
    source: str

class Transaction(BaseModel):
    date: str
    description: str
    amount: float
    direction: str
    balance: Optional[float] = None
    

class BatchReq(BaseModel):
    transactions: List[Transaction]

class FeedbackItem(BaseModel):
    desc: str
    corrected_category:   str

class FeedbackTrainReq(BaseModel):
    feedback: List[FeedbackItem]

# ---- Endpoints ----
@app.post("/classifier/predict", response_model=PredictRes)
def single_predict(req: PredictReq):
    try:
        result = classify_batch([req.description])[0]
        return PredictRes(category=result["category"], source=result["source"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/classifier/predict-batch", response_model=List[PredictRes])
def batch_predict(req: BatchReq):
    try:
        descriptions = [t.description for t in req.transactions]
        results = classify_batch(descriptions, 8)
        return [PredictRes(category=r["category"], source=r["source"]) for r in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/classifier/train")
def retrain():
    try:
        train_model()
        return {"status": "retraining started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/classifier/feedback-train")
def retrain_with_feedback(req: FeedbackTrainReq, background_tasks: BackgroundTasks):
    try:
        # This will append the feedbacks to disk & kickoff a retrain
        payload = [item.dict() for item in req.feedback]
        background_tasks.add_task(train_feedback, payload)
        return {"status": "feedback-based retraining started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- insights ---
@app.get("/insights/userId")
def get_insights(req: int):
    """
    Get AI score for userID
    """
    return {"insights": []}


@app.get("/insights/{user_id}/{month}")
def get_monthly_insights(user_id: int, month: int):
    """
    Returns a Spotify-Wrapped style summary for `user_id` and `month`.
    """
    try:
        # 1. Pull raw user data from your DB
        user_data = fetch_user_data(user_id, month)

        # 2. Pass into the Python insights engine
        result = generate_wrapped_insights(user_data)

        # 3. Return a combined payload
        return {
            "user_id": user_id,
            "month": month,
            **result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/insights/{user_id}")
def get_current_month_insights(user_id: int):
    """
    Shortcut: fetch insights for the current month.
    """
    current_month = datetime.now().month
    return get_monthly_insights(user_id, current_month)

# --- serve ---
if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=6000, log_level="info")