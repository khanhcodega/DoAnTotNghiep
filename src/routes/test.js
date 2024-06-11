const TestController = require('../app/controllers/TestController');
const express = require('express');
const router = express.Router();
const upload = require('../app/middlewares/upload'); // Đường dẫn tới file cấu hình Multer

<<<<<<< HEAD

=======
router.post('/set-ma-so', TestController.setMaSo);
router.put('/update-user', upload.single('avatar'), TestController.update);
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7

router.get('/', TestController.index);

module.exports = router;
