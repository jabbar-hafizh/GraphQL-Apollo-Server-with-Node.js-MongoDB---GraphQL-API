const multer = require('multer');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, callback) => {
  console.log('asd');
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError('Not an image file format'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImage = upload.single('file');

exports.removeImageFromServer = async (bucket_file_name) => {
  fs.unlink(`public/fileuploads/${bucket_file_name}`, (err) => {
    console.error(err);
  });
};
