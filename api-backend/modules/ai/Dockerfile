# Based on your existing Dockerfile with production improvements
FROM python:3.11-slim AS base

# Install system dependencies (keeping your existing ones + security updates)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    libgl1-mesa-dev \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Create non-root user (production security)
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Dependencies stage (keeping your optimized approach)
FROM base AS deps
COPY app/requirements.txt ./

# Upgrade pip first (keeping your approach)
RUN pip install --upgrade pip

# Install the heaviest dependencies first with extended timeout (your approach)
RUN pip install --no-cache-dir --timeout=1000 torch==2.1.0

# Install transformers separately (your approach)  
RUN pip install --no-cache-dir --timeout=1000 transformers==4.33.2

# Fix PyArrow compatibility issue (your approach)
RUN pip install --no-cache-dir "pyarrow>=12.0.0,<15.0.0"

# Install remaining dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Development stage
FROM base AS development
COPY --from=deps /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=deps /usr/local/bin/ /usr/local/bin/
COPY . .
RUN chown -R appuser:appuser /app
USER appuser
ENV PYTHONPATH=/app
EXPOSE 6000
CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "6000", "--reload"]

# Production stage
FROM base AS production

# Copy dependencies from deps stage (your approach)
COPY --from=deps /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
COPY --from=deps /usr/local/bin/ /usr/local/bin/

# Copy application code
COPY --chown=appuser:appuser . .

# Switch to non-root user (production security)
USER appuser

# Set environment
ENV PYTHONPATH=/app

# Expose port
EXPOSE 6000

# Health check (production monitoring)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:6000/health', timeout=5)"

# Production command - keeping single worker due to ML model memory usage
CMD ["uvicorn", "app.server:app", "--host", "0.0.0.0", "--port", "6000", "--workers", "1"]