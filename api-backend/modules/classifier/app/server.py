# api-backend/modules/classifier/app/server.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uvicorn

# import your service-layer functions
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

# ---- Service-layer functions ----
from app.services.extract_transactions import (
    ocr_pdf_to_text,
    clean_lines,
    classify_row,
    parse_transactions,
    pdf_to_json
)
from app.services.predict_classifier import classify_batch
from app.services.train_classifier import main as train_model
from app.services.feedback_trainer import main as train_feedback

app = FastAPI(title="Transaction Classifier")

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
    balance: float

class BatchReq(BaseModel):
    transactions: List[Transaction]

class FeedbackItem(BaseModel):
    transactionId: int
    categoryId:   int

class FeedbackTrainReq(BaseModel):
    feedbacks: List[FeedbackItem]

# ---- Endpoints ----
@app.post("/predict", response_model=PredictRes)
def single_predict(req: PredictReq):
    try:
        result = classify_batch([req.description])[0]
        return PredictRes(category=result["category"], source=result["source"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-batch", response_model=List[PredictRes])
def batch_predict(req: BatchReq):
    try:
        descriptions = [t.description for t in req.transactions]
        results = classify_batch(descriptions)
        return [PredictRes(category=r["category"], source=r["source"]) for r in results]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
def retrain():
    try:
        train_model()
        return {"status": "retraining started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/feedback-train")
def retrain_with_feedback(req: FeedbackTrainReq):
    try:
        # This will append the feedbacks to disk & kickoff a retrain
        train_feedback([f.dict() for f in req.feedbacks])
        return {"status": "feedback-based retraining started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- serve ---
if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=6000, log_level="info")