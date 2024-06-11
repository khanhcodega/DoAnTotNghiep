const RentalController = require('../app/controllers/RentalController')
const express = require('express')
const router = express.Router()

router.get('/:id',RentalController.show)
router.post('/api/toggle-like',RentalController.toggleLike)
router.post('/api/history-news',RentalController.historyNews)
router.get('/',RentalController.index)
module.exports = router