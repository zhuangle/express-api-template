const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { UploadFilePath } = require('../config/config.default')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 指定上传文件的存储路径
    cb(null, UploadFilePath);
  },
  filename: function (req, file, cb) {
    // 指定上传文件的文件名

    const fileExtension = file.originalname.split('.')[1]
    const newFileName = uuidv4()+ '.' + fileExtension
    cb(null, newFileName);

    const newFile = {
      userId: req.id,
      originalName: file.originalname.split('.')[0],
      fileType: file.mimetype,
      newFileName,
      fileExtension,
    }
    delete req.file
    req.newFile = newFile

  },
});

module.exports = multer({ storage: storage });


