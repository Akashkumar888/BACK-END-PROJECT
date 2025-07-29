const multer = require('multer');

// 1. Use memory storage
let storage = multer.memoryStorage();

// 2. Allow only certain image MIME types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } 
  else {
    cb(new Error('Only JPG, PNG, WEBP images are allowed'), false); // Reject file
  }
};

// 3. Create multer middleware
const upload = multer({ storage, fileFilter }); // ✅ both keys passed correctly

// 4. Export it
module.exports = upload;


