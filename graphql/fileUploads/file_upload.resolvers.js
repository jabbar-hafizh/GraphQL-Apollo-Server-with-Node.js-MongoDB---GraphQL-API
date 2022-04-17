const path = require('path');

const FileUploadUtilities = require('./file_upload.utilities');

async function SingleUpload(parent, args) {
  return args.file.then(async (file) => {
    let { filename, createReadStream } = await file;
    let originalnName = filename;
    let extention = path.extname(filename);
    let newFilename = await FileUploadUtilities.SaveFileToServer(
      path.parse(filename.split(' ').join('-').split('/').join('-').split('#').join('-').split('%').join('-')).name,
      createReadStream,
      args.custom_file_name,
      extention
    );

    return {
      original_file_name: originalnName,
      bucket_file_name: newFilename.originalname + extention,
      file_url: `${process.env.SERVER_ENV === 'production' ? process.env.URL : process.env.API_BASE}/fileuploads/${
        newFilename.originalname
      }${extention}`,
      mime_type: file.mimetype,
      encoding: file.encoding,
    };
  });
}

module.exports = {
  Mutation: {
    SingleUpload,
  },
};
