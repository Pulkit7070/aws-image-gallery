# Quickstart: running this on another machine

Two ways to run it. The first needs no AWS account and is what to use if your
teacher wants to see it working on their own laptop. The second is the real
deployment on EC2 and S3.

---

## Option 1: run it locally, no AWS account

A local S3-compatible server stands in for Amazon S3, so every line of
`app/app.py` runs unchanged against a real S3 API. Nothing in the application
code is mocked or faked.

Needs Python 3.9 or newer and git. Takes about a minute the first time.

```bash
git clone https://github.com/<user>/<repo>.git
cd <repo>
./run_local.sh
```

Then open **http://127.0.0.1:8080** in a browser.

The script creates the virtual environment, installs the dependencies, starts
the local S3 server on port 5111, creates the bucket, and runs the app. Press
Ctrl-C to stop everything.

On Windows, run the same steps by hand in PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\pip install -r app\requirements.txt -r requirements-dev.txt
.\.venv\Scripts\python -m moto.server -p 5111
```

then in a second window:

```powershell
$env:AWS_ENDPOINT_URL="http://127.0.0.1:5111"
$env:AWS_ACCESS_KEY_ID="local"; $env:AWS_SECRET_ACCESS_KEY="local"
$env:AWS_REGION="ap-south-1"; $env:GALLERY_BUCKET="demo-gallery-bucket"
.\.venv\Scripts\python -c "import boto3; boto3.client('s3', region_name='ap-south-1').create_bucket(Bucket='demo-gallery-bucket', CreateBucketConfiguration={'LocationConstraint':'ap-south-1'})"
cd app; ..\.venv\Scripts\python app.py
```

### What to show once it is open

1. Upload an image. It appears as a card with its size and upload time, both
   read back from S3 rather than stored anywhere locally.
2. Click a thumbnail. The URL in the address bar is a presigned link with an
   expiry and a signature in the query string. That link stops working after an
   hour even though the bucket is private.
3. Try uploading a `.txt` file. It is refused before any S3 call is made.
4. Delete an image. The object leaves the bucket; there is no database row.
5. Visit `http://127.0.0.1:8080/health` to show which bucket and region the app
   is pointed at.

To prove the file really lives in object storage and not on disk, run this in
another terminal while the app is up:

```bash
AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local \
  aws s3 ls s3://demo-gallery-bucket/uploads/ \
  --endpoint-url http://127.0.0.1:5111 --region ap-south-1
```

The keys listed there are exactly the cards on the page.

---

## Option 2: the real thing on AWS

Full click-by-click instructions, the IAM policy, and the systemd service are in
[`docs/DEPLOY.md`](docs/DEPLOY.md). The short version, on a fresh Amazon Linux
2023 instance that has the IAM role attached:

```bash
git clone https://github.com/<user>/<repo>.git
cd <repo>
sudo dnf install -y python3-pip
pip3 install -r app/requirements.txt

export GALLERY_BUCKET=your-bucket-name
export AWS_REGION=ap-south-1
python3 app/app.py
```

Open `http://<public-ip>:8080`. There are no access keys anywhere: boto3 picks up
temporary credentials from the instance role.

---

## The presentation

- `deck/AWS-Image-Gallery-Project.pdf` for handing in or presenting from
- `deck/AWS-Image-Gallery-Project.pptx` if you want to edit it, with speaker
  notes on every slide
- Fill in the `Name · Roll number · Class · Date` line on slide 1

Rebuild the deck after an edit:

```bash
node deck/build-deck.js
soffice --headless --convert-to pdf --outdir deck deck/AWS-Image-Gallery-Project.pptx
```
