const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const AppError = require('./appError');
const config = require('../config/config');

// Configure Cloudinary safely, throw error if config is missing
if (!config.cloudinary.cloudName || !config.cloudinary.apiKey || !config.cloudinary.apiSecret) {
  throw new Error('Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.');
}
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

// Define folder structure
const FOLDERS = {
  PROFILES: 'aero-agriculture/users/profiles',
  PLANTS: 'aero-agriculture/plants/images',
  SENSORS: 'aero-agriculture/sensors/data'
};

// Create storage engine factory
const createStorage = (folder) => {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // Resize large images
      format: 'webp', // Convert all images to WebP for better compression
    },
  });
};

// File filter function
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new AppError('Only image files are allowed!', 400), false);
  }
  cb(null, true);
};

// Create multer instances for different upload types
const createUploader = (folder) => {
  return multer({
    storage: createStorage(folder),
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  });
};

// Export upload middlewares
module.exports = {
  uploadProfileImage: createUploader(FOLDERS.PROFILES).single('profileImg'),
  uploadPlantImage: createUploader(FOLDERS.PLANTS).single('plantImg'),
  uploadSensorImage: createUploader(FOLDERS.SENSORS).single('sensorImg'),
  cloudinary, // Export cloudinary instance for direct operations
  FOLDERS // Export folders for reference
}; 