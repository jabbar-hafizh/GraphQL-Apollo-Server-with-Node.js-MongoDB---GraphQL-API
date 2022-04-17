const multer = require('multer');

const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError('Not an image file format'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: multerFilter,
});

const uploadCloudinary = multer({
  storage: multer.diskStorage({}),
  fileFilter: multerFilter,
});

exports.uploadImage = upload.single('file');
exports.uploadImageCloudinary = uploadCloudinary.single('file');
