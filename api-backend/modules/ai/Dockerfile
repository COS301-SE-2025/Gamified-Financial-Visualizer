# syntax=docker/dockerfile:1.7

########################
# Base
########################
FROM python:3.11-slim-bookworm AS base

# Avoid interactive tzdata etc.
ENV DEBIAN_FRONTEND=noninteractive \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DEFAULT_TIMEOUT=1000 \
    # Where HF downloads will be stored if you prefetch models at build or runtime
    HF_HOME=/app/.cache/huggingface \
    TRANSFORMERS_CACHE=/app/.cache/huggingface \
    PYTHONUNBUFFERED=1

# Install only runtime libs (drop *-dev to shrink)
# BuildKit's apt cache mount keeps runner disk low and speeds repeated builds
RUN --mount=type=cache,target=/var/cache/apt \
    apt-get update && \
    apt-get install -y --no-install-recommends \
      tesseract-ocr \
      tesseract-ocr-eng \
      poppler-utils \
      libgl1 \
      libglib2.0-0 \
      libsm6 \
      libxext6 \
      libxrender1 \
      libgomp1 \
      ca-certificates \
      curl && \
    rm -rf /var/lib/apt/lists/*

# Create non-root
RUN groupadd -r appuser && useradd -r -g appuser appuser
WORKDIR /app

########################
# Deps
########################
FROM base AS deps

ARG TORCH_VER=2.1.0
# Use official CPU wheel index so pip never tries to compile Torch
ARG TORCH_INDEX=https://download.pytorch.org/whl/cpu

# Copy minimal dependency manifest early for caching
COPY app/requirements.txt ./requirements.txt

# Use BuildKit pip cache, prefer wheels only to avoid builds from source
RUN --mount=type=cache,target=/root/.cache/pip \
    python -m pip install --upgrade pip && \
    python -m pip install --prefer-binary --only-binary=:all: --index-url $TORCH_INDEX \
        torch==${TORCH_VER} && \
    python -m pip install --prefer-binary --only-binary=:all: \
        "transformers==4.33.2" \
        "pyarrow>=12.0.0,<15.0.0" && \
    python -m pip install --prefer-binary -r requirements.txt

########################
# Dev image (optional)
########################
FROM base AS development
COPY --from=deps /usr/local /usr/local
COPY . .
RUN chown -R appuser:appuser /app
USER appuser
ENV PYTHONPATH=/app
EXPOSE 6000
CMD ["uvicorn","app.server:app","--host","0.0.0.0","--port","6000","--reload"]

########################
# (Optional) Prefetch models at build
# This prevents runtime HF downloads and avoids timeouts in App Service.
# Comment this stage out if you want to keep the image smaller.
########################


########################
# Production
########################
FROM base AS production

# Bring in Python deps (includes torch, transformers)
COPY --from=deps /usr/local /usr/local
# If you used prefetch stage above, copy its cache into the final image:
# (uncomment next line if you used the prefetch stage)
# COPY --from=prefetch /app/.cache/huggingface /app/.cache/huggingface

# Copy app code
COPY --chown=appuser:appuser . .

USER appuser
ENV PYTHONPATH=/app
EXPOSE 6000

# Healthcheck uses Python stdlib http.client (avoid adding 'requests' just for HC)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD python -c "import http.client; c = http.client.HTTPConnection('localhost', 6000, timeout=5); c.request('GET', '/health'); r = c.getresponse(); exit(0 if r.status==200 else 1)"

CMD ["uvicorn","app.server:app","--host","0.0.0.0","--port","6000","--workers","1"]
