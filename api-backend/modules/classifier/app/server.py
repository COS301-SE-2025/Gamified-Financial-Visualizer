from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/predict")
async def predict(request: Request):
    data = await request.json()
    desc = data.get("description", "")
    category = "Food & Dining" if "mcdonalds" in desc.lower() else "Uncategorized"
    return {"category": category}

@app.get("/health")
async def health():
    return {"status": "ok"}
