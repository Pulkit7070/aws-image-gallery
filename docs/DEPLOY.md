# Deploying on AWS (about 20 minutes, Free Tier)

Region used throughout: `ap-south-1` (Mumbai). Any region works, keep it the same everywhere.

## 1. Create the S3 bucket

1. S3 console, **Create bucket**.
2. Name: `cloud-gallery-<your-name>-2026` (bucket names are globally unique).
3. Region: `ap-south-1`.
4. Leave **Block all public access** ON. The app serves images through presigned
   URLs, so the bucket never needs to be public.
5. Create.

## 2. Create an IAM role for EC2

IAM, **Roles**, **Create role**, trusted entity **AWS service**, use case **EC2**.
Attach an inline policy (replace the bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::cloud-gallery-<your-name>-2026"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::cloud-gallery-<your-name>-2026/uploads/*"
    }
  ]
}
```

Name the role `ec2-gallery-role`. No access keys are stored on the instance:
the role supplies temporary credentials, which is the point to make in the viva.

## 3. Launch the EC2 instance

- AMI: Amazon Linux 2023, instance type `t2.micro` or `t3.micro` (Free Tier).
- Key pair: create or reuse one, download the `.pem`.
- Security group inbound rules: SSH (22) from **My IP**, Custom TCP **8080** from
  `0.0.0.0/0` for the demo.
- Advanced details, **IAM instance profile**: `ec2-gallery-role`.
- Launch, then copy the Public IPv4 address.

## 4. Install and run the app

```bash
ssh -i your-key.pem ec2-user@<public-ip>

sudo dnf install -y python3-pip git
mkdir -p ~/gallery && cd ~/gallery
# copy app.py, templates/index.html, requirements.txt here (scp or git clone)
pip3 install -r requirements.txt

export GALLERY_BUCKET=cloud-gallery-<your-name>-2026
export AWS_REGION=ap-south-1
python3 app.py
```

Open `http://<public-ip>:8080` in a browser. Upload an image, then refresh the S3
console: the object appears under `uploads/`.

## 5. Keep it running after you log out (optional but good for the demo)

```bash
sudo tee /etc/systemd/system/gallery.service > /dev/null <<'EOF'
[Unit]
Description=Cloud Image Gallery
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/home/ec2-user/gallery
Environment=GALLERY_BUCKET=cloud-gallery-<your-name>-2026
Environment=AWS_REGION=ap-south-1
ExecStart=/usr/bin/gunicorn -w 2 -b 0.0.0.0:8080 app:app
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable --now gallery
sudo systemctl status gallery
```

## 6. Screenshots to capture for the report

1. S3 bucket with `uploads/` objects listed.
2. IAM role summary page showing the attached policy.
3. EC2 instance running, with its public IP visible.
4. Browser showing the gallery with uploaded images.
5. `curl http://<public-ip>:8080/health` output.

## 7. Shut down to avoid charges

Terminate the EC2 instance, then empty and delete the bucket.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| Page loads, gallery always empty | Wrong `GALLERY_BUCKET`, or role missing `s3:ListBucket` |
| "Upload failed. Check the IAM role" | Policy missing `s3:PutObject` on `uploads/*` |
| Browser hangs on the public IP | Port 8080 not open in the security group |
| Broken image thumbnails | Presigned URL expired, refresh the page |
