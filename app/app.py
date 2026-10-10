"""Cloud-Based Image Storage and Gallery System (AWS EC2 + S3).

The Flask app runs on EC2. Every uploaded image is stored as an object in an
S3 bucket; nothing is written to the EC2 disk, so the instance stays stateless.
Images are served through short-lived presigned URLs, so the bucket itself can
stay private.
"""

import os
import uuid
from datetime import datetime

import boto3
from botocore.exceptions import ClientError
from flask import Flask, flash, redirect, render_template, request, url_for

BUCKET = os.environ.get("GALLERY_BUCKET", "")
REGION = os.environ.get("AWS_REGION", "ap-south-1")
PREFIX = "uploads/"
ALLOWED = {".png", ".jpg", ".jpeg", ".gif", ".webp"}
URL_TTL = 3600

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "dev-only-change-me")
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

s3 = boto3.client("s3", region_name=REGION)


def _ext(filename):
    return os.path.splitext(filename)[1].lower()


def list_images():
    """Return gallery items newest-first, each with a presigned view URL."""
    try:
        pages = s3.get_paginator("list_objects_v2").paginate(
            Bucket=BUCKET, Prefix=PREFIX
        )
        objects = [o for page in pages for o in page.get("Contents", [])]
    except ClientError as err:
        app.logger.error("list_objects_v2 failed: %s", err)
        return []

    objects.sort(key=lambda o: o["LastModified"], reverse=True)
    return [
        {
            "key": o["Key"],
            "name": o["Key"][len(PREFIX):],
            "size_kb": round(o["Size"] / 1024, 1),
            "uploaded": o["LastModified"].strftime("%d %b %Y, %H:%M UTC"),
            "url": s3.generate_presigned_url(
                "get_object",
                Params={"Bucket": BUCKET, "Key": o["Key"]},
                ExpiresIn=URL_TTL,
            ),
        }
        for o in objects
    ]


@app.route("/")
def index():
    return render_template(
        "index.html", images=list_images(), bucket=BUCKET, region=REGION
    )


@app.route("/upload", methods=["POST"])
def upload():
    file = request.files.get("image")
    if not file or not file.filename:
        flash("Choose an image first.", "error")
        return redirect(url_for("index"))

    if _ext(file.filename) not in ALLOWED:
        flash(f"Unsupported file type. Allowed: {', '.join(sorted(ALLOWED))}", "error")
        return redirect(url_for("index"))

    # Timestamp + uuid keeps keys unique so two users never overwrite each other.
    stamp = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    key = f"{PREFIX}{stamp}-{uuid.uuid4().hex[:6]}{_ext(file.filename)}"

    try:
        s3.upload_fileobj(
            file,
            BUCKET,
            key,
            ExtraArgs={"ContentType": file.mimetype or "application/octet-stream"},
        )
    except ClientError as err:
        app.logger.error("upload failed: %s", err)
        flash("Upload failed. Check the IAM role and bucket name.", "error")
        return redirect(url_for("index"))

    flash(f"Uploaded to s3://{BUCKET}/{key}", "ok")
    return redirect(url_for("index"))


@app.route("/delete/<path:key>", methods=["POST"])
def delete(key):
    if not key.startswith(PREFIX):
        flash("Invalid object key.", "error")
        return redirect(url_for("index"))
    try:
        s3.delete_object(Bucket=BUCKET, Key=key)
        flash("Image deleted.", "ok")
    except ClientError as err:
        app.logger.error("delete failed: %s", err)
        flash("Delete failed.", "error")
    return redirect(url_for("index"))


@app.route("/health")
def health():
    return {"status": "ok", "bucket": BUCKET, "region": REGION}


if __name__ == "__main__":
    if not BUCKET:
        raise SystemExit("Set GALLERY_BUCKET to your S3 bucket name.")
    app.run(host="0.0.0.0", port=8080)
