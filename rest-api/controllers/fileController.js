const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const cloudinary = require('../../utils/cloudinary');
const common = require('../../utils/common');

const random = common.create_UUID();

async function singleUpload(req, res) {
  let bucket_file_name = req.params && req.params.custom_file_name ? req.params.custom_file_name : req.file.originalname;
  bucket_file_name = `${random}-${bucket_file_name}.jpeg`.replace(/\s/g, '');

  try {
    console.log('req.file', req.file);
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
    return res.status(200).json({ message: `${req.params.bucket_file_name} successfully deleted` });
  } catch (error) {
    return res.status(400).json({ message: `${req.params.bucket_file_name} fail to deleted` }, { error: error });
  }
}

async function singleUploadCloudinary(req, res) {
  try {
    if (req.file.size > 1000000) {
      return res.status(400).json({ message: 'max size 1 mb' });
    }

    const cloudinary_uploaded = await cloudinary.uploader.upload(req.file.path);
    const bucket_file_name = cloudinary_uploaded.secure_url.split('/');

    return res.json({
      original_file_name: req.file.originalname,
      bucket_file_name: bucket_file_name[bucket_file_name.length - 1],
      file_url: cloudinary_uploaded.secure_url,
      cloudinary_public_id: cloudinary_uploaded.public_id,
      mime_type: req.file.mimetype,
      encoding: req.file.encoding,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(400).json({ message: `${req.params.bucket_file_name} fail to upload` }, { error: error });
  }
}

async function removeFileFromCloudinary(req, res) {
  try {
    await cloudinary.uploader.destroy(req.params.cloudinary_public_id);
    return res.status(200).json({ message: `Cloudinary with public id ${req.params.cloudinary_public_id} successfully deleted` });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Cloudinary with public id ${req.params.cloudinary_public_id} fail to deleted` }, { error: error });
  }
}

module.exports = {
  singleUpload,
  getLocalFile,
  removeFileFromServer,
  singleUploadCloudinary,
  removeFileFromCloudinary,
};
