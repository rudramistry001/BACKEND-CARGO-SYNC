import multer from 'multer';

// Configure Multer for in-memory storage
const storage = multer.memoryStorage(); // Use memoryStorage for in-memory handling

// Validate file type using fileFilter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png') {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Only PNG files are allowed!'), false); // Reject file
  }
};

// Initialize Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Optional: Limit file size to 2 MB
});

// Middleware to convert the image to Base64
const convertToBase64 = (req, res, next) => {
  try {
    if (req.file) {
      // Convert the in-memory file buffer to Base64
      req.file.base64 = req.file.buffer.toString('base64');
    }
    next();
  } catch (err) {
    console.error('Error converting file to Base64:', err.message);
    res.status(500).json({ message: 'Failed to process file!' });
  }
};

export { upload, convertToBase64 };
