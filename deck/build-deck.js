const pptxgen = require("pptxgenjs");
const path = require("path");

/* Editorial light deck: warm paper, serif headlines, pastel blocks,
   hairline rules, wide margins. */

const pres = new pptxgen();
pres.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pres.layout = "WIDE";
pres.author = "Student Project";
pres.title = "Cloud-Based Image Storage and Gallery System";

const PAPER = "F7F5F0";
const INK = "1C1E1C";
const BODY = "4D5551";
const FAINT = "6E756F";
const RULE = "DFDAD0";
const ACCENT = "2F5D62";
const SAGE = "E7EDE6";
const SAND = "F0E8DA";
const MIST = "E3EAEF";
const BLUSH = "F1E4E1";
const CODEBG = "EFEDE7";

const SERIF = "Georgia";
const SANS = "Calibri";
const MONO = "Consolas";

const M = 0.95;
const W = 13.333 - M * 2;
const SHOT = path.join(__dirname, "..", "docs", "screenshots", "gallery.png");

const NOTES = [
  "Open with the title. This project takes the simplest idea on the list and uses it to show what cloud computing is actually about: keeping the application separate from the data. Two AWS services, EC2 and S3.",
  "Give the audience the shape of the talk in one breath, then move on. Do not read all six lines aloud.",
  "Set up the problem before the solution. Ask where the photos go if you build this on a normal college server. Answer: onto that one machine's disk. Then walk the four blocks.",
  "State the scope plainly so nobody expects features that are not there. Then point at the three numbers: two services, zero files on the instance disk, eleven nines of durability, which means S3 is built never to lose an object.",
  "EC2 is a rented computer. S3 is not a disk, it is a store of objects addressed by key. IAM is the part most student projects skip: it lets the server use the bucket with no password in the code.",
  "Spend the most time here. Trace the arrows left to right, then make the three points underneath: the instance holds nothing, S3 holds the truth, no keys live in the code.",
  "Walk the six steps in order. The point to land on is step four, the file streams straight to S3 and never touches the EC2 disk. Step six explains presigned URLs.",
  "Expect a question about why the bucket is not public, so answer it here. Left column is the shortcut most tutorials take, right column is what this project does.",
  "Do not read the code line by line. Four boto3 calls do the whole job: upload, list, sign a link, delete. Point out there is no password anywhere in the file.",
  "Switch to the live application if you can, otherwise use this screenshot. Upload an image, then open the S3 console and show the same object appearing under the uploads prefix.",
  "Deployment is a short repeatable sequence and all five steps are in the report. Mention the Free Tier and that you terminate the instance afterwards.",
  "Say what you tested rather than claiming it works. Four normal cases and three failure cases, including a byte-for-byte check that the image returned is identical to the one uploaded.",
  "Being honest about limits makes the viva easier. No login, so anyone with the address can upload. Then give the four extensions.",
  "Close on the single idea: EC2 is disposable, S3 is durable, and separating them is what makes the system scalable. Then invite questions.",
];

let n = 0;
function page() {
  const s = pres.addSlide();
  s.background = { color: PAPER };
  s.addNotes(NOTES[n]);
  n += 1;
  return s;
}

function header(s, kicker, title, num) {
  s.addText(kicker.toUpperCase(), {
    x: M, y: 0.52, w: 8, h: 0.28,
    fontFace: SANS, fontSize: 10.5, bold: true, color: ACCENT, charSpacing: 2.4,
  });
  s.addText(title, {
    x: M, y: 0.84, w: W - 1.0, h: 0.68,
    fontFace: SERIF, fontSize: 30, color: INK,
  });
  s.addText(String(num).padStart(2, "0"), {
    x: 13.333 - M - 0.9, y: 0.95, w: 0.9, h: 0.4, align: "right",
    fontFace: SANS, fontSize: 11, color: FAINT, charSpacing: 1,
  });
  s.addShape(pres.ShapeType.line, {
    x: M, y: 1.72, w: W, h: 0, line: { color: RULE, width: 0.75 },
  });
  return s;
}

function block(s, o) {
  s.addShape(pres.ShapeType.roundRect, {
    x: o.x, y: o.y, w: o.w, h: o.h,
    fill: { color: o.fill }, rectRadius: 0.05, line: { color: o.fill, width: 0 },
  });
}

function dotList(items) {
  return items.map(function (t) {
    return { text: t, options: { bullet: { code: "2022", indent: 18 }, breakLine: true } };
  });
}

/* ---------------- 1. title ---------------- */
{
  const s = page();
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.1, fill: { color: ACCENT } });
  block(s, { x: 8.3, y: 1.7, w: 4.1, h: 4.1, fill: SAGE });
  block(s, { x: 7.5, y: 2.85, w: 2.4, h: 2.4, fill: SAND });
  s.addText("S3", {
    x: 7.5, y: 2.85, w: 2.4, h: 2.4, align: "center", valign: "middle",
    fontFace: SERIF, fontSize: 44, color: ACCENT,
  });
  s.addText("AWS CLOUD COMPUTING   ·   PROJECT 26", {
    x: M, y: 1.8, w: 6.5, h: 0.3,
    fontFace: SANS, fontSize: 10.5, bold: true, color: ACCENT, charSpacing: 2.4,
  });
  s.addText("Cloud-Based Image\nStorage and\nGallery System", {
    x: M, y: 2.2, w: 6.2, h: 2.4,
    fontFace: SERIF, fontSize: 36, color: INK, lineSpacing: 44,
  });
  s.addShape(pres.ShapeType.line, { x: M, y: 4.95, w: 5.8, h: 0, line: { color: RULE, width: 0.75 } });
  s.addText("A stateless web application on Amazon EC2 that keeps every uploaded image as an object in Amazon S3.", {
    x: M, y: 5.12, w: 5.8, h: 0.8,
    fontFace: SANS, fontSize: 14, color: BODY, lineSpacing: 22,
  });
  s.addText("Name   ·   Roll number   ·   Class   ·   Date", {
    x: M, y: 6.45, w: 7, h: 0.35, fontFace: SANS, fontSize: 12, color: FAINT,
  });
}

/* ---------------- 2. contents ---------------- */
{
  const s = page();
  header(s, "Contents", "What this presentation covers", 1);
  const items = [
    ["01", "The problem", "Why one server is the wrong place for files"],
    ["02", "Objective and scope", "What the system does, and what it does not"],
    ["03", "The AWS services", "EC2, S3 and the role that connects them"],
    ["04", "Architecture", "How a request travels from browser to bucket"],
    ["05", "Security", "Keeping the bucket private with signed links"],
    ["06", "Demonstration", "The running application and its test results"],
  ];
  items.forEach(function (it, i) {
    const x = M + (i % 2) * (W / 2 + 0.3);
    const y = 2.2 + Math.floor(i / 2) * 1.5;
    s.addText(it[0], { x: x, y: y - 0.02, w: 0.7, h: 0.42, fontFace: SERIF, fontSize: 19, color: ACCENT });
    s.addText(it[1], { x: x + 0.75, y: y, w: 4.5, h: 0.4, fontFace: SERIF, fontSize: 18, color: INK });
    s.addText(it[2], { x: x + 0.75, y: y + 0.44, w: 4.7, h: 0.45, fontFace: SANS, fontSize: 13, color: BODY });
    s.addShape(pres.ShapeType.line, { x: x, y: y + 1.08, w: W / 2 - 0.35, h: 0, line: { color: RULE, width: 0.75 } });
  });
}

/* ---------------- 3. problem ---------------- */
{
  const s = page();
  header(s, "The problem", "Why not just store images on the server?", 2);
  s.addText("Build this the ordinary way and every photo lands on one machine's disk. Four things then go wrong, and all of them go wrong quietly.", {
    x: M, y: 2.0, w: 8.0, h: 0.7, fontFace: SANS, fontSize: 14.5, color: BODY, lineSpacing: 23,
  });
  const items = [
    ["Disk fills up", "Storage is fixed. Photos pile up until uploads start failing.", SAND],
    ["One copy only", "If the machine dies, every uploaded image dies with it.", MIST],
    ["Cannot scale out", "A second server holds different files, so users see different galleries.", SAGE],
    ["Manual backups", "Someone has to remember to copy the folder somewhere safe.", BLUSH],
  ];
  items.forEach(function (it, i) {
    const x = M + i * 2.921;
    block(s, { x: x, y: 3.1, w: 2.67, h: 2.3, fill: it[2] });
    s.addText(it[0], { x: x + 0.3, y: 3.36, w: 2.07, h: 0.5, fontFace: SERIF, fontSize: 16.5, color: INK });
    s.addText(it[1], { x: x + 0.3, y: 3.96, w: 2.07, h: 1.25, valign: "top", fontFace: SANS, fontSize: 12.5, color: BODY, lineSpacing: 18 });
  });
  s.addText("The cloud answer is a split: the application stays on EC2, the files move to S3.", {
    x: M, y: 6.0, w: W, h: 0.4, fontFace: SERIF, fontSize: 15, italic: true, color: ACCENT,
  });
}

/* ---------------- 4. objective ---------------- */
{
  const s = page();
  header(s, "Objective", "What the system does", 3);
  s.addText("Scope", { x: M, y: 2.05, w: 3, h: 0.4, fontFace: SERIF, fontSize: 18, color: INK });
  s.addText(
    dotList([
      "Upload an image from any browser",
      "Store it as an object in a private S3 bucket",
      "List every stored image, newest first",
      "View the full image through a signed link",
      "Delete an image from the bucket",
      "Reject non-image files and anything over 10 MB",
    ]),
    { x: M, y: 2.6, w: 5.4, h: 3.4, valign: "top", fontFace: SANS, fontSize: 14, color: BODY, lineSpacing: 30 }
  );
  const stats = [
    ["2", "AWS services at the core", "EC2 for compute, S3 for storage"],
    ["0", "files on the instance disk", "the server stays disposable"],
    ["11", "nines of durability", "S3 is built never to lose an object"],
  ];
  stats.forEach(function (st, i) {
    const y = 2.15 + i * 1.45;
    s.addText(st[0], { x: 7.1, y: y, w: 1.2, h: 0.85, align: "right", fontFace: SERIF, fontSize: 40, color: ACCENT });
    s.addText(st[1], { x: 8.55, y: y + 0.08, w: 3.8, h: 0.4, fontFace: SERIF, fontSize: 16, color: INK });
    s.addText(st[2], { x: 8.55, y: y + 0.5, w: 3.8, h: 0.42, fontFace: SANS, fontSize: 12.5, color: BODY });
    if (i < 2) {
      s.addShape(pres.ShapeType.line, { x: 7.1, y: y + 1.18, w: 5.25, h: 0, line: { color: RULE, width: 0.75 } });
    }
  });
}

/* ---------------- 5. services ---------------- */
{
  const s = page();
  header(s, "Building blocks", "The AWS services used", 4);
  const svc = [
    ["EC2", "Elastic Compute Cloud", "A t3.micro virtual machine running the Flask application on port 8080. Free Tier eligible.", SAND],
    ["S3", "Simple Storage Service", "Object storage holding every uploaded image under the uploads prefix of one private bucket.", MIST],
    ["IAM", "Identity and Access Management", "A role on the instance that hands the application temporary keys, so no password sits in the code.", SAGE],
  ];
  svc.forEach(function (it, i) {
    const x = M + i * 3.92;
    block(s, { x: x, y: 2.1, w: 3.6, h: 3.5, fill: it[3] });
    s.addText(it[0], { x: x + 0.38, y: 2.35, w: 2.9, h: 0.75, fontFace: SERIF, fontSize: 30, color: ACCENT });
    s.addText(it[1], { x: x + 0.38, y: 3.2, w: 2.9, h: 0.7, valign: "top", fontFace: SERIF, fontSize: 15.5, color: INK, lineSpacing: 21 });
    s.addText(it[2], { x: x + 0.38, y: 4.0, w: 2.9, h: 1.4, valign: "top", fontFace: SANS, fontSize: 12.5, color: BODY, lineSpacing: 18 });
  });
  s.addText("Deliberately small. No database, no load balancer, no Lambda: two services are enough to show the one idea that matters.", {
    x: M, y: 6.0, w: W, h: 0.5, fontFace: SANS, fontSize: 13.5, color: FAINT,
  });
}

/* ---------------- 6. architecture ---------------- */
{
  const s = page();
  header(s, "Architecture", "How the pieces fit together", 5);
  const COLS = [M, M + 3.011, M + 6.022, M + 9.033];
  const CW = 2.4;
  const boxes = [
    ["User browser", "uploads and views", MIST],
    ["Amazon EC2", "Flask app, port 8080", SAND],
    ["Amazon S3", "private bucket", SAGE],
    ["IAM role", "temporary keys", BLUSH],
  ];
  boxes.forEach(function (b, i) {
    block(s, { x: COLS[i], y: 2.2, w: CW, h: 1.45, fill: b[2] });
    s.addText(b[0], { x: COLS[i], y: 2.4, w: CW, h: 0.42, align: "center", fontFace: SERIF, fontSize: 15.5, color: INK });
    s.addText(b[1], { x: COLS[i], y: 2.88, w: CW, h: 0.38, align: "center", fontFace: SANS, fontSize: 11.5, color: BODY });
  });
  [["HTTP", 0], ["boto3", 1], ["grants", 2]].forEach(function (a) {
    const i = a[1];
    const start = COLS[i] + CW + 0.14;
    const w = COLS[i + 1] - start - 0.14;
    s.addShape(pres.ShapeType.line, {
      x: start, y: 2.93, w: w, h: 0,
      line: { color: ACCENT, width: 1.5, endArrowType: "triangle" },
    });
    s.addText(a[0], { x: start - 0.12, y: 2.45, w: w + 0.24, h: 0.3, align: "center", fontFace: SANS, fontSize: 10.5, color: FAINT });
  });
  const notes = [
    ["EC2 stays stateless", "Nothing is saved on the instance disk. Terminate it, launch a new one, and the gallery is unchanged."],
    ["S3 holds the truth", "Objects live under uploads/ with a timestamped unique key, so two users can never overwrite each other."],
    ["No keys in the code", "The role supplies rotating credentials, so nothing secret is ever committed to the repository."],
  ];
  notes.forEach(function (it, i) {
    const x = M + i * 3.92;
    s.addShape(pres.ShapeType.line, { x: x, y: 4.3, w: 3.6, h: 0, line: { color: RULE, width: 0.75 } });
    s.addText(it[0], { x: x, y: 4.47, w: 3.5, h: 0.4, fontFace: SERIF, fontSize: 15.5, color: INK });
    s.addText(it[1], { x: x, y: 4.95, w: 3.5, h: 1.3, valign: "top", fontFace: SANS, fontSize: 12.5, color: BODY, lineSpacing: 18 });
  });
  s.addText("The split between the two middle boxes is the whole project.", {
    x: M, y: 6.4, w: W, h: 0.4, fontFace: SERIF, fontSize: 14.5, italic: true, color: ACCENT,
  });
}

/* ---------------- 7. request flow ---------------- */
{
  const s = page();
  header(s, "Request flow", "What happens when you press Upload", 6);
  const steps = [
    ["Browser posts the file", "A multipart form sends the image to /upload on the instance."],
    ["The app validates it", "The extension must be an image type and the body under 10 MB."],
    ["A unique key is built", "uploads/20261010-141655-5e12be.png, a timestamp plus a random suffix."],
    ["boto3 streams it to S3", "upload_fileobj sends the bytes through. Nothing touches the EC2 disk."],
    ["The gallery re-reads S3", "list_objects_v2 returns every object, which the app sorts newest first."],
    ["Signed links render it", "Each thumbnail gets a URL valid for one hour. The bucket stays private."],
  ];
  steps.forEach(function (st, i) {
    const x = M + (i % 2) * (W / 2 + 0.3);
    const y = 2.15 + Math.floor(i / 2) * 1.55;
    s.addText(String(i + 1).padStart(2, "0"), { x: x, y: y - 0.04, w: 0.6, h: 0.42, fontFace: SERIF, fontSize: 18, color: ACCENT });
    s.addText(st[0], { x: x + 0.7, y: y, w: 4.8, h: 0.4, fontFace: SERIF, fontSize: 16.5, color: INK });
    s.addText(st[1], { x: x + 0.7, y: y + 0.44, w: 4.8, h: 0.72, valign: "top", fontFace: SANS, fontSize: 12.5, color: BODY, lineSpacing: 18 });
    s.addShape(pres.ShapeType.line, { x: x, y: y + 1.22, w: W / 2 - 0.35, h: 0, line: { color: RULE, width: 0.75 } });
  });
}

/* ---------------- 8. security ---------------- */
{
  const s = page();
  header(s, "Security", "Keeping the bucket private", 7);
  block(s, { x: M, y: 2.05, w: 5.55, h: 3.1, fill: BLUSH });
  s.addText("The shortcut, avoided", { x: M + 0.4, y: 2.3, w: 4.8, h: 0.42, fontFace: SERIF, fontSize: 17.5, color: INK });
  s.addText(
    dotList([
      "Make the bucket public so image tags work",
      "Paste access keys into the source file",
      "Anyone guessing a URL reads every image",
      "A leaked key becomes a leaked account",
    ]),
    { x: M + 0.4, y: 2.82, w: 4.75, h: 2.1, valign: "top", fontFace: SANS, fontSize: 13, color: "6B4A46", lineSpacing: 26 }
  );
  block(s, { x: M + 5.88, y: 2.05, w: 5.55, h: 3.1, fill: SAGE });
  s.addText("What this project does", { x: M + 6.28, y: 2.3, w: 4.8, h: 0.42, fontFace: SERIF, fontSize: 17.5, color: INK });
  s.addText(
    dotList([
      "Block Public Access stays switched on",
      "An IAM role gives rotating credentials",
      "Presigned URLs expire after one hour",
      "The role may only touch the uploads prefix",
    ]),
    { x: M + 6.28, y: 2.82, w: 4.75, h: 2.1, valign: "top", fontFace: SANS, fontSize: 13, color: "3C5248", lineSpacing: 26 }
  );
  s.addShape(pres.ShapeType.line, { x: M, y: 5.65, w: W, h: 0, line: { color: RULE, width: 0.75 } });
  s.addText("Least privilege in one line: the application may read, write and delete under uploads/*, and nothing else in the account.", {
    x: M, y: 5.85, w: W, h: 0.5, fontFace: SERIF, fontSize: 15, italic: true, color: ACCENT,
  });
}

/* ---------------- 9. implementation ---------------- */
{
  const s = page();
  header(s, "Implementation", "The part that talks to AWS", 8);
  block(s, { x: M, y: 2.05, w: 7.0, h: 4.3, fill: CODEBG });
  s.addText(
    "s3 = boto3.client(\"s3\", region_name=REGION)\n\n" +
    "# upload: stream the file into the bucket\n" +
    "key = f\"uploads/{stamp}-{uuid4().hex[:6]}{ext}\"\n" +
    "s3.upload_fileobj(file, BUCKET, key,\n" +
    "        ExtraArgs={\"ContentType\": file.mimetype})\n\n" +
    "# list: every object, newest first\n" +
    "objects = s3.list_objects_v2(Bucket=BUCKET,\n" +
    "               Prefix=\"uploads/\")[\"Contents\"]\n\n" +
    "# view: a link that works for one hour\n" +
    "url = s3.generate_presigned_url(\"get_object\",\n" +
    "        Params={\"Bucket\": BUCKET, \"Key\": key},\n" +
    "        ExpiresIn=3600)",
    { x: M + 0.35, y: 2.3, w: 6.4, h: 3.8, valign: "top", fontFace: MONO, fontSize: 11.5, color: "2E3330", lineSpacing: 18 }
  );
  const rows = [
    ["boto3", "The AWS SDK for Python. Each call is one HTTPS request to the S3 API."],
    ["No credentials", "boto3 finds the instance role on its own. No access key in this file."],
    ["Unique keys", "A timestamp plus six random characters, so uploads cannot collide."],
    ["Expiring links", "A presigned URL is the bucket signing a time-limited permission."],
  ];
  rows.forEach(function (r, i) {
    const y = 2.1 + i * 1.18;
    s.addText(r[0], { x: 8.4, y: y, w: 4.0, h: 0.36, fontFace: SERIF, fontSize: 15.5, color: INK });
    s.addText(r[1], { x: 8.4, y: y + 0.38, w: 4.0, h: 0.62, valign: "top", fontFace: SANS, fontSize: 12.5, color: BODY, lineSpacing: 18 });
    if (i < 3) {
      s.addShape(pres.ShapeType.line, { x: 8.4, y: y + 1.04, w: 4.0, h: 0, line: { color: RULE, width: 0.75 } });
    }
  });
}

/* ---------------- 10. demo ---------------- */
{
  const s = page();
  header(s, "Demonstration", "The running application", 9);
  s.addImage({ path: SHOT, x: M, y: 2.1, w: 7.7, h: 3.19 });
  s.addText("The gallery with four objects in the bucket.", {
    x: M, y: 5.4, w: 7.7, h: 0.35, fontFace: SANS, fontSize: 12, italic: true, color: FAINT,
  });
  const points = [
    ["Upload", "The panel posts the file straight to S3."],
    ["Cards", "Each card is one object in the bucket."],
    ["Metadata", "Size and time are read from S3 itself."],
    ["Thumbnails", "Loaded over presigned URLs."],
    ["Delete", "Removes the object, not a database row."],
  ];
  points.forEach(function (p, i) {
    const y = 2.15 + i * 0.84;
    s.addText(p[0], { x: 9.15, y: y, w: 3.25, h: 0.32, fontFace: SERIF, fontSize: 15, color: ACCENT });
    s.addText(p[1], { x: 9.15, y: y + 0.32, w: 3.25, h: 0.48, valign: "top", fontFace: SANS, fontSize: 12.5, color: BODY, lineSpacing: 18 });
  });
}

/* ---------------- 11. deployment ---------------- */
{
  const s = page();
  header(s, "Deployment", "Getting it onto AWS", 10);
  const steps = [
    ["Create the bucket", "Block Public Access stays switched on."],
    ["Create the IAM role", "Read, write and delete on uploads/* only."],
    ["Launch t3.micro", "Attach the role, open ports 22 and 8080."],
    ["Install and run", "Set the bucket name, start the app with gunicorn."],
    ["Open the public IP", "Upload, then confirm the object in the S3 console."],
  ];
  steps.forEach(function (st, i) {
    const x = M + i * 2.35;
    s.addText(String(i + 1).padStart(2, "0"), { x: x, y: 2.25, w: 1.2, h: 0.5, fontFace: SERIF, fontSize: 25, color: ACCENT });
    s.addShape(pres.ShapeType.line, { x: x, y: 2.9, w: 2.05, h: 0, line: { color: RULE, width: 0.75 } });
    s.addText(st[0], { x: x, y: 3.05, w: 1.95, h: 0.72, valign: "top", fontFace: SERIF, fontSize: 15, color: INK, lineSpacing: 20 });
    s.addText(st[1], { x: x, y: 3.8, w: 1.95, h: 1.4, valign: "top", fontFace: SANS, fontSize: 12, color: BODY, lineSpacing: 17 });
  });
  block(s, { x: M, y: 5.5, w: W, h: 0.95, fill: SAND });
  s.addText("The whole setup takes about twenty minutes and stays inside the AWS Free Tier. Terminate the instance and empty the bucket afterwards to keep the bill at zero.", {
    x: M + 0.4, y: 5.5, w: W - 0.8, h: 0.95, valign: "middle", fontFace: SANS, fontSize: 13.5, color: "4F4737",
  });
}

/* ---------------- 12. results ---------------- */
{
  const s = page();
  header(s, "Results", "What was tested", 11);
  const rows = [
    ["Upload a PNG", "Object appears in the bucket, bytes identical to the file sent"],
    ["View an image", "Presigned URL returns HTTP 200 and the exact uploaded bytes"],
    ["List the gallery", "Every object listed newest first, with size and timestamp"],
    ["Delete an image", "Object removed, the gallery falls back to its empty state"],
    ["Upload a .txt file", "Rejected with a message, nothing written to the bucket"],
    ["Upload with no file", "Rejected with a message, no request sent to S3"],
    ["Delete outside uploads/", "Refused as an invalid key, no S3 call made at all"],
  ];
  let y = 2.1;
  s.addText("TEST CASE", { x: M, y: y, w: 3.3, h: 0.32, fontFace: SANS, fontSize: 10.5, bold: true, color: FAINT, charSpacing: 1.6 });
  s.addText("EXPECTED AND OBSERVED RESULT", { x: M + 3.5, y: y, w: 6.5, h: 0.32, fontFace: SANS, fontSize: 10.5, bold: true, color: FAINT, charSpacing: 1.6 });
  s.addText("STATUS", { x: M + 10.2, y: y, w: 1.2, h: 0.32, align: "right", fontFace: SANS, fontSize: 10.5, bold: true, color: FAINT, charSpacing: 1.6 });
  y += 0.4;
  s.addShape(pres.ShapeType.line, { x: M, y: y, w: W, h: 0, line: { color: ACCENT, width: 1 } });
  y += 0.1;
  rows.forEach(function (r) {
    s.addText(r[0], { x: M, y: y, w: 3.3, h: 0.5, valign: "middle", fontFace: SERIF, fontSize: 13.5, color: INK });
    s.addText(r[1], { x: M + 3.5, y: y, w: 6.5, h: 0.5, valign: "middle", fontFace: SANS, fontSize: 12.5, color: BODY });
    s.addText("Pass", { x: M + 10.2, y: y, w: 1.2, h: 0.5, align: "right", valign: "middle", fontFace: SANS, fontSize: 12.5, bold: true, color: ACCENT });
    y += 0.55;
    s.addShape(pres.ShapeType.line, { x: M, y: y - 0.03, w: W, h: 0, line: { color: RULE, width: 0.75 } });
  });
  s.addText("Every case was run against a live S3 API, including a byte-for-byte comparison of what each presigned URL returned.", {
    x: M, y: y + 0.2, w: W, h: 0.4, fontFace: SANS, fontSize: 12.5, italic: true, color: FAINT,
  });
}

/* ---------------- 13. scope ---------------- */
{
  const s = page();
  header(s, "Scope", "Honest limits, and what comes next", 12);
  s.addText("Current limitations", { x: M, y: 2.05, w: 5, h: 0.4, fontFace: SERIF, fontSize: 17.5, color: INK });
  s.addText(
    dotList([
      "No login, so anyone with the address can upload",
      "One bucket holding one shared gallery",
      "Thumbnails are full-size downloads",
      "A single instance, so no failover",
    ]),
    { x: M, y: 2.6, w: 5.0, h: 2.6, valign: "top", fontFace: SANS, fontSize: 13.5, color: BODY, lineSpacing: 30 }
  );
  s.addText("Where it goes next", { x: 6.85, y: 2.05, w: 5, h: 0.4, fontFace: SERIF, fontSize: 17.5, color: INK });
  const future = [
    ["Cognito logins", "A private prefix per user in the same bucket."],
    ["Lambda thumbnails", "Resize on upload through an S3 event trigger."],
    ["CloudFront", "Cache images at the edge instead of signing each view."],
    ["DynamoDB metadata", "Titles, tags and captions beside the objects."],
  ];
  future.forEach(function (f, i) {
    const y = 2.6 + i * 0.95;
    s.addText(f[0], { x: 6.85, y: y, w: 5.5, h: 0.34, fontFace: SERIF, fontSize: 15, color: ACCENT });
    s.addText(f[1], { x: 6.85, y: y + 0.32, w: 5.5, h: 0.4, fontFace: SANS, fontSize: 12.5, color: BODY });
    if (i < 3) {
      s.addShape(pres.ShapeType.line, { x: 6.85, y: y + 0.82, w: 5.5, h: 0, line: { color: RULE, width: 0.75 } });
    }
  });
  s.addText("Every extension plugs into the same two-service core, which is why the simple version was worth building first.", {
    x: M, y: 6.2, w: W, h: 0.4, fontFace: SERIF, fontSize: 14.5, italic: true, color: ACCENT,
  });
}

/* ---------------- 14. conclusion ---------------- */
{
  const s = page();
  s.addShape(pres.ShapeType.rect, { x: 0, y: 7.4, w: 13.333, h: 0.1, fill: { color: ACCENT } });
  block(s, { x: 8.5, y: 2.0, w: 3.9, h: 3.6, fill: SAGE });
  s.addText("The one idea\nto remember", {
    x: 8.85, y: 2.55, w: 3.3, h: 1.5, fontFace: SERIF, fontSize: 21, color: ACCENT, lineSpacing: 30,
  });
  s.addText("CONCLUSION", {
    x: M, y: 2.0, w: 6, h: 0.3, fontFace: SANS, fontSize: 10.5, bold: true, color: ACCENT, charSpacing: 2.4,
  });
  s.addText("Separate the compute\nfrom the storage.", {
    x: M, y: 2.4, w: 7.2, h: 1.4, fontFace: SERIF, fontSize: 32, color: INK, lineSpacing: 42,
  });
  s.addShape(pres.ShapeType.line, { x: M, y: 4.05, w: 6.4, h: 0, line: { color: RULE, width: 0.75 } });
  s.addText(
    "EC2 runs the code and can be thrown away at any moment. S3 keeps the images durable and independent of whichever server happens to be running. That single split is what makes the application scalable, and it is the whole lesson of this project.",
    { x: M, y: 4.25, w: 6.7, h: 1.5, valign: "top", fontFace: SANS, fontSize: 14, color: BODY, lineSpacing: 23 }
  );
  s.addText("Thank you.  Questions welcome.", {
    x: M, y: 6.0, w: 7, h: 0.5, fontFace: SERIF, fontSize: 19, color: INK,
  });
}

pres.writeFile({ fileName: path.join(__dirname, "AWS-Image-Gallery-Project.pptx") })
  .then(function (f) { console.log("written:", f); });
