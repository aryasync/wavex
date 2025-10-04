import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// Return all saved items
app.get("/api/items", (req, res) => {
  let data = [];
  if (fs.existsSync("data.json")) {
    data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
  }
  res.json(data);
});

// Add a new item
app.post("/api/items", (req, res) => {
  let data = [];
  if (fs.existsSync("data.json")) {
    data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
  }
  data.push(req.body);
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  res.json({ success: true });
});

// Upload receipt image (later: OCR here)
app.post("/api/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.json({ message: "Image received!", file: req.file });
});

app.listen(5000, () => console.log("✅ Backend running on port 5000"));
