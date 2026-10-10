#!/usr/bin/env bash
# Run the gallery on this machine with no AWS account.
#
# A local S3-compatible server (moto) stands in for Amazon S3, so every boto3
# call in app.py runs unchanged against a real S3 API. The application code is
# identical to what runs on EC2.
set -euo pipefail

cd "$(dirname "$0")"
PORT=8080
S3_PORT=5111
BUCKET=demo-gallery-bucket

if [ ! -d .venv ]; then
  echo "==> creating virtual environment"
  python3 -m venv .venv
  ./.venv/bin/pip install --quiet --upgrade pip
  ./.venv/bin/pip install --quiet -r app/requirements.txt -r requirements-dev.txt
fi

export AWS_ENDPOINT_URL="http://127.0.0.1:${S3_PORT}"
export AWS_ACCESS_KEY_ID=local
export AWS_SECRET_ACCESS_KEY=local
export AWS_REGION=ap-south-1
export GALLERY_BUCKET="$BUCKET"

echo "==> starting local S3 on port ${S3_PORT}"
./.venv/bin/python -m moto.server -p "$S3_PORT" > /tmp/local-s3.log 2>&1 &
S3_PID=$!
trap 'kill $S3_PID 2>/dev/null || true' EXIT

for _ in $(seq 1 30); do
  curl -sf -o /dev/null "http://127.0.0.1:${S3_PORT}/" && break
  sleep 0.5
done

./.venv/bin/python - <<PY
import boto3
boto3.client("s3", region_name="ap-south-1").create_bucket(
    Bucket="${BUCKET}",
    CreateBucketConfiguration={"LocationConstraint": "ap-south-1"},
)
print("==> bucket ${BUCKET} ready")
PY

echo "==> gallery running at http://127.0.0.1:${PORT}   (Ctrl-C to stop)"
cd app && exec ../.venv/bin/python app.py
