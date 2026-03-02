# SMAD - Superconducting Materials Automated Discovery
# Production Docker image for https://smad.live

FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY main.py config.py database.py security.py .
COPY templates/ templates/
COPY static/ static/

# SQLite DB path (override via env; mount volume at /app/data for persistence)
ENV DATABASE_URL=sqlite:////app/data/smad.db
RUN mkdir -p /app/data

EXPOSE 8000

# Production: bind to 0.0.0.0 for container networking
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
