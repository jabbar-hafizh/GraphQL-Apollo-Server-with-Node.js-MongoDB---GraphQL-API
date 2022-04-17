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

    let stream = createReadStream()
      .on('error', (error) => {
        if (stream.truncated) {
          // delete the truncated file
          fs.unlinkSync(location);
        }
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

        resolve(file);
      });
  });
};

async function SaveFile(filename, createReadStream, custom_file_name = '', extName) {
  return new Promise((resolve, reject) => {
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

module.exports = { SaveFileToServer, SaveFile };
