const baseModel = require('./baseModel')
module.exports = (sequelize, DataTypes) => {

  // 用户上传的文件信息 
  const FileUploads = sequelize.define('file_uploads', {
    // 保存用户上传的文件
    /* 
      uid - 文件唯一id uuid
      purpose - 用途
      original_filename - 文件原始名称
      new_filename - 文件新名称
      file_extension - 文件后缀
      file_type - 文件类型
      file_md5 - 文件MD5值
      file_size - 文件大小
    */
  //  文件id
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    uid: {
      type: DataTypes.UUID,
      required: true
    },
    purpose: {
      type: DataTypes.STRING,
    },
    originalName: {
      type: DataTypes.STRING,
      required: true
    },
    newFileName: {
      type: DataTypes.STRING,
      required: true
    },
    fileExtension: {
      type: DataTypes.STRING,
    },
    fileType: {
      type: DataTypes.STRING,
      required: true
    },
    fileSize: {
      type: DataTypes.STRING,
    },
    ...baseModel
  });

  return {
    FileUploads
  };
};