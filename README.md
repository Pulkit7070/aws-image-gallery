<img src="assets/icon.svg" width="64" height="64" alt="">

# Cloud-Based Image Storage and Gallery System

AWS Cloud Computing project 26 from the 60-topic list: the simplest one there,
two services and no database.

A Flask web app runs on an **EC2** instance. Every uploaded image is stored as an
object in a private **S3** bucket, and served back through presigned URLs that
expire after an hour. Nothing is written to the instance disk, so the server can
be terminated and replaced without losing a single image.

## Run it in one command, no AWS account

```bash
./run_local.sh      # then open http://127.0.0.1:8080
```

A local S3-compatible server stands in for Amazon S3, so every boto3 call in
`app/app.py` runs unchanged against a real S3 API. See
[`QUICKSTART.md`](QUICKSTART.md) for Windows steps and what to demonstrate.

## What is here

| Path | What it is |
| --- | --- |
| `app/app.py` | The whole application, about 120 lines |
| `app/templates/index.html` | The gallery page |
| `run_local.sh` | One-command local demo, no AWS account needed |
| `QUICKSTART.md` | Clone-and-run instructions for another machine |
| `docs/DEPLOY.md` | Step-by-step AWS setup, Free Tier, about 20 minutes |
| `deck/AWS-Image-Gallery-Project.pdf` | The presentation, 14 slides |
| `deck/AWS-Image-Gallery-Project.pptx` | Editable version, with speaker notes |
| `deck/build-deck.js` | Script that generates the deck |

## Running it on AWS

Follow `docs/DEPLOY.md`. The short version, on an instance with the IAM role
attached:

```bash
export GALLERY_BUCKET=your-bucket-name
export AWS_REGION=ap-south-1
pip3 install -r app/requirements.txt
python3 app/app.py          # http://<public-ip>:8080
```

Credentials come from the role. There are no access keys in the source.

## What was tested

Verified by running the app against a live S3 API, not by reading the code:

- Upload a PNG, object appears in the bucket with identical bytes
- Presigned URL returns HTTP 200 and the exact uploaded file
- Gallery lists every object, newest first, with size and timestamp
- Delete removes the object and the gallery falls back to the empty state
- A `.txt` upload is rejected, nothing written to the bucket
- An upload with no file selected is rejected before any S3 call
- A delete for a key outside `uploads/` is refused

## Limitations

No authentication, one shared gallery, thumbnails are full-size downloads, and a
single instance with no failover. `docs/DEPLOY.md` and slide 12 cover what would
come next: Cognito logins, Lambda thumbnails, CloudFront, DynamoDB metadata.
