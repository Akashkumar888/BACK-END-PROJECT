
const express = require('express');
const router = express.Router();

const upload = require('../config/multer.config');
const { createProduct } = require('../controllers/product.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware'); // if using auth

router.post(
  "/create",
  isAuthenticated,                // optional
  upload.array('images', 5),     // <- important, matches frontend field name
  createProduct
);

module.exports = router;

// 🔹 upload.single("image")
// Used when you're uploading a single file from a specific field.
// Expects the form field name to be "image".
// The uploaded file is available as 
// req.file.// ✔️ only one file

// 🔸 upload.any()
// Used when you're not sure what the field names will be or you're uploading multiple files from different fields.
// Accepts files from any field.
// All uploaded files are available as an array in 
// req.files.// ✔️ array of all files


