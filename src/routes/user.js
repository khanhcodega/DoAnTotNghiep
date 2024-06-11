const UserController = require('../app/controllers/UserController');
const express = require('express');
const router = express.Router();
const upload = require('../app/middlewares/upload'); // Đường dẫn tới file cấu hình Multer

<<<<<<< HEAD
<<<<<<< HEAD
router.put('/update-user', upload.single('avatar'), UserController.update);
router.get('/quan-ly-tin/:id', UserController.getInfoNews)
// router.get('/quan-ly-tin/cap-nhat-tin',UserController.previewNews)

router.delete('/quan-ly-tin/:id/delete', UserController.deleteNews)
router.put('/quan-ly-tin/:id/edit', upload.fields([{ name: 'images', maxCount: 12 }, { name: 'video', maxCount: 1 }]), UserController.updateNews)

router.get('/quan-ly-tin', UserController.storeNews)
router.get('/lich-su-xem-tin', UserController.historyNews)
router.get('/tin-da-luu', UserController.saveNews)

router.get('/quan-ly-tai-khoan', UserController.index);
=======
router.post('/set-ma-so', UserController.setMaSo);
router.put('/update-user', upload.single('avatar'), UserController.update);
router.get('/', UserController.index);
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7
=======
router.post('/set-ma-so', UserController.setMaSo);
router.put('/update-user', upload.single('avatar'), UserController.update);
router.get('/', UserController.index);
>>>>>>> a503d10ea67dc4a8a4eb8e6a56dce9e6c0d636b7

module.exports = router;
