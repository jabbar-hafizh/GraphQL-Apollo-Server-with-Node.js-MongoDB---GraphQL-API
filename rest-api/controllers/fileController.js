const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const common = require('../../utils/common');

const random = common.create_UUID();

async function singleUpload(req, res) {
  let bucket_file_name = req.params && req.params.custom_file_name ? req.params.custom_file_name : req.file.originalname;
  bucket_file_name = `${random}-${bucket_file_name}.jpeg`.replace(/\s/g, '');

  try {
    await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/fileuploads/${bucket_file_name}`);
    return res.json({
      original_file_name: req.file.originalname,
      bucket_file_name: bucket_file_name,
      file_url: `${process.env.SERVER_ENV === 'production' ? process.env.URL : process.env.API_BASE}/fileuploads/${bucket_file_name}`,
      mime_type: req.file.mimetype,
      encoding: req.file.encoding,
    });
  } catch (error) {
    console.log('error', error);
    return res.json('Not Found.');
  }
}

async function getLocalFile(req, res) {
  let fileName = req.params.bucket_file_name;

  try {
    const file = `./public/fileuploads/${fileName}`;
    res.download(file);
  } catch (error) {
    return res.json('Not Found.');
  }
}

async function removeFileFromServer(req, res) {
  try {
    fs.unlink(path.join(process.cwd(), '/public/fileuploads/' + req.params.bucket_file_name), () => {});
    res.status(200).json({ message: `${req.params.bucket_file_name} successfully deleted` });
  } catch (error) {
    res.status(400).json({ message: `${req.params.bucket_file_name} fail to deleted` }, { error: error });
  }
}

module.exports = {
  singleUpload,
  getLocalFile,
  removeFileFromServer,
};
