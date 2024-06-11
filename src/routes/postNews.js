const express = require('express')
const router = express.Router()
const PostNewsController = require('../app/controllers/PostNewsController')
const upload = require('../app/middlewares/upload');
router.get('/api/cities', PostNewsController.getCity)
router.get('/api/districts', PostNewsController.getDistricts)
router.get('/api/wards', PostNewsController.getWards)
router.get('/api/categorytypes', PostNewsController.getCategoryType)
router.post('/api/create-post', upload.fields([{ name: 'images', maxCount: 12 }, { name: 'video', maxCount: 1 }]), PostNewsController.createPost)
router.get('/', PostNewsController.index)


module.exports = router