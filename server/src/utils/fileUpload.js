const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AppError = require('./appError');

// Create storage directories if they don't exist
const createStorageDirectory = (directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
};

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    
    // Determine upload path based on file type
    if (file.fieldname === 'profileImg') {
      uploadPath = 'uploads/profiles';
    } else if (file.fieldname === 'plantImg') {
      uploadPath = 'uploads/plants';
    } else {
      uploadPath = 'uploads/others';
    }
    
    // Create directory if it doesn't exist
    createStorageDirectory(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new AppError('Only image files are allowed!', 400), false);
  }
  cb(null, true);
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Export middleware functions for different upload scenarios
module.exports = {
  uploadProfileImage: upload.single('profileImg'),
  uploadPlantImage: upload.single('plantImg'),
  // Add more upload middlewares as needed
}; 