const fileController = require('./controllers/fileController');

const utils = require('./utils');

module.exports = (app) => {
  app.post('/singleupload/:custom_file_name', utils.uploadImage, fileController.singleUpload);
  app.get('/fileuploads/:bucket_file_name', fileController.getLocalFile);
  app.delete('/removeFileFromServer/:bucket_file_name', fileController.removeFileFromServer);
  app.post('/singleUploadCloudinary/', utils.uploadImage, fileController.singleUploadCloudinary);
  app.delete('/removeFileFromCloudinary/:cloudinary_public_id', fileController.removeFileFromCloudinary);
};
