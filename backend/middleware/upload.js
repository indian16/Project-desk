const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create required folders
const documentDir = path.join(__dirname, "../uploads/documents");
const checklistDir = path.join(__dirname, "../uploads/checklist");
const otherDir = path.join(__dirname, "../uploads/other");

fs.mkdirSync(documentDir, { recursive: true });
fs.mkdirSync(checklistDir, { recursive: true });
fs.mkdirSync(otherDir, { recursive: true });

// Storage logic based on route
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const url = req.originalUrl;

    if (url.includes("upload-head-doc")) {
      return cb(null, documentDir); // Head uploads documents
    }

    if (url.includes("upload-checklist")) {
      return cb(null, checklistDir); // Students upload checklist
    }

    cb(null, otherDir);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;

