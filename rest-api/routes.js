const fileController = require('./controllers/fileController');

const utils = require('./utils');

module.exports = (app) => {
  app.post('/singleupload/:custom_file_name', utils.uploadImage, fileController.singleUpload);
  app.get('/fileuploads/:bucket_file_name', fileController.getLocalFile);
  app.get('/removeFileFromServer/:bucket_file_name', fileController.removeFileFromServer);
};
