const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');

const common = require('../../utils/common');

/**
 * To save filte to local server
 *
 * @param {string} filename file name
 * @param {function} createReadStream createReadStream function
 * @param {customLocation} customLocation custom save location
 * @returns {Promise<object>} object of { originalname & buffer }
 */
const SaveFileToServer = async (filename, createReadStream, customLocation, extName) => {
  return new Promise((resolve, reject) => {
    let uploadDir = customLocation;
    let random = common.create_UUID();
    let newFilename = `${random}-${filename}`;
    let location = `${uploadDir ? uploadDir : './public/fileuploads/'}${newFilename}${extName}`;
    console.log('location', location);

    let stream = createReadStream()
      .on('error', (error) => {
        console.log('error 1111', error);

        if (stream.truncated) {
          // delete the truncated file
          fs.unlinkSync(location);
        }
        reject(error);
      })
      .pipe(fs.createWriteStream(location))
      .on('error', (error) => {
        console.log('error 2222', error);

        reject(error);
      })
      .on('finish', async () => {
        let file = {
          originalname: '',
          buffer: '',
        };

        file.buffer = fs.readFileSync(location);
        file.originalname = newFilename;
        console.log('file', file);

        resolve(file);
      });
  });
};

async function SaveFile(filename, createReadStream, custom_file_name = '', extName) {
  return new Promise((resolve, reject) => {
    console.log('filename', filename);
    let uploadDir = './public/fileuploads';
    let random = common.create_UUID();
    let newFilename = `${
      custom_file_name === '' || _.isNil(custom_file_name)
        ? filename
        : custom_file_name.split(' ').join('-').split('/').join('-').split('#').join('-').split('%').join('-')
    }-${random}${extName}`;
    let location = `${uploadDir}/${newFilename}`;

    let stream = createReadStream()
      .on('error', (error) => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(location);
        reject(error);
      })
      .pipe(fs.createWriteStream(location))
      .on('error', (error) => reject(error))
      .on('finish', async () => {
        let file = {
          originalname: '',
          buffer: '',
        };

        file.buffer = fs.readFileSync(location);
        file.originalname = newFilename;

        try {
          let s3 = await awsService.uploadToS3(file);

          fs.unlinkSync(location);

          resolve(s3);
        } catch (err) {
          reject(err);
        }
      });
  });
}

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, callback) => {
//   if (file.mimetype.startsWith('image')) {
//     callback(null, true);
//   } else {
//     callback(new Error('Not image file format'), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// exports.uploadUserPhoto = upload.single('file');

// exports.resizeUserPhoto = async (req, res, next) => {
//   try {
//     let user;
//     // ini untuk create
//     if (!req.params.id) {
//       user = req.body;
//     }

//     req.file.filename = `user-${user.role}-${user.NIP}.jpeg`.replace(/\s/g, '');

//     await sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(`public/fileuploads/${req.file.filename}`);

//     next();
//   } catch (err) {
//     next(err);
//   }
// };

// async function removeImageFromServer(bucket_file_name) {
//   fs.unlink(`public/fileuploads/${bucket_file_name}`, (err) => {
//     console.error(err);
//   });
// }

module.exports = { SaveFileToServer, SaveFile };
