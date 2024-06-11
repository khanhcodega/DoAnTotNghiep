const multer = require('multer');
const path = require('path');

// Cấu hình Multer để lưu trữ tệp trong thư mục 'public/uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

<<<<<<< HEAD



=======
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
const upload = multer({ storage: storage });

module.exports = upload;
