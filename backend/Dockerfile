FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set Python path
ENV PYTHONPATH=/app

# Wait for database and run migrations
CMD ["sh", "-c", "sleep 10 && alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]

