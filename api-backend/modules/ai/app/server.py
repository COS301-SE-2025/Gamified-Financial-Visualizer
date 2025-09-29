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

# For AI advisor
from transformers import pipeline
from itertools import groupby

# ---- Service-layer functions ----
from app.classifier.services.predict_classifier import classify_batch
from app.classifier.services.train_classifier import main as train_model
from app.classifier.services.feedback_trainer import main as train_feedback
from app.insights.services.trend_analysis import (
   run_trend_analysis
)
from app.insights.services.insights_engine import (
    generate_wrapped_insights,
)

from app.classifier.services.predict_classifier import is_model_ready, load_model

app = FastAPI(title="AI Service")

@app.on_event("startup")
async def startup_event():
    load_model()
    if not is_model_ready():
        print("Warning: Model failed to load at startup.")
    else:
        print("Model loaded successfully at startup.")

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


class Transaction1(BaseModel): # this is for trends insights
    date: str
    description: str
    amount: float
    transaction_type: str
    category: str

class Goal(BaseModel):
    id: int
    title: str
    status: str
    target_amount: float
    progress: float

class Budget(BaseModel):
    category: str
    amount: float



class UserData(BaseModel):
    transactions: List[Transaction1]
    goals: List[Goal]
    budgets: List[Budget]


# --- Chat endpoint schema ---
class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    response: str

# --- Load GPT model once at startup ---
# MODEL_NAME = "openai-community/gpt2"
# MODEL_NAME = "openai/gpt-oss-20b" // lighter model
MODEL_NAME = "openai/gpt-oss-120b"
generator = pipeline('text-generation', model=MODEL_NAME)

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    try:
        user_input = req.question.strip()
        if not user_input:
            raise HTTPException(status_code=400, detail="No question provided")
        
        # Generate text
        result = generator(
            user_input,
            max_new_tokens=250,
            num_return_sequences=1,
            temperature=0.7,
            top_p=0.95,
            do_sample=True,
            pad_token_id=generator.tokenizer.eos_token_id,
        )

        text = result[0]['generated_text'].strip()

        # Remove repeated consecutive words/phrases
        words = text.split()
        text = " ".join(k for k,_ in itertools.groupby(words))

        # Cut at last sentence-ending punctuation
        last_punct = max(text.rfind("."), text.rfind("?"), text.rfind("!"))
        if last_punct != -1:
            text = text[:last_punct + 1]

        return ChatResponse(response=text)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
def get_monthly_insights(user_id: int, month: int, user_data: UserData):
    """
    Returns a Spotify-Wrapped style summary for `user_id` and `month`.
    """
    try:
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

@app.post("/insights/user/{user_id}/{month}")
def wrapped_insights(user_id: int, month: int, user_data: UserData):
    try:
        result = generate_wrapped_insights(user_data.dict())
        return result
    except Exception as e:
        print(f"Error generating insights for user {user_id} in month {month}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/insights/trends")
def get_trends(user_data: UserData):
    """
    Returns a dictionary of trends for the user.
    """
    try:
        # Extract features from user data
        result = run_trend_analysis(user_data.dict())
        return result
    except Exception as e:
        print(f"Error generating trends for user: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "ok", "ready": is_model_ready()}





# --- serve ---
if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=6000, log_level="info")