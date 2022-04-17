const { gql } = require('apollo-server-express');

const fileUpload = gql`
  scalar Upload

  type File {
    original_file_name: String
    bucket_file_name: String
    file_url: String
    mime_type: String
    encoding: String
  }

  type Image {
    original_file_name: String
    bucket_file_name: String
    file_url: String
    cloudinary_public_id: String
  }

  input ImageInput {
    original_file_name: String
    bucket_file_name: String
    file_url: String
    cloudinary_public_id: String
  }

  extend type Mutation {
    SingleUpload(file: Upload!, custom_file_name: String): File
  }
`;

module.exports = fileUpload;
