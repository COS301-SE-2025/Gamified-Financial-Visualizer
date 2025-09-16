FROM python:3.11-slim AS base

# Install system dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils \
    libgl1-mesa-dev \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies stage
FROM base AS deps
COPY app/requirements.txt ./

# Upgrade pip first
RUN pip install --upgrade pip

# Install the heaviest dependencies first with extended timeout
RUN pip install --no-cache-dir --timeout=1000 torch==2.1.0

# Install transformers separately  
RUN pip install --no-cache-dir --timeout=1000 transformers==4.33.2

# Fix PyArrow compatibility issue
RUN pip install --no-cache-dir "pyarrow>=12.0.0,<15.0.0"

# Install remaining dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Final stage
FROM base AS final
COPY --from=deps /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=deps /usr/local/bin/ /usr/local/bin/
COPY . .
ENV PYTHONPATH=/app
EXPOSE 6000
CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "6000"]