const express = require('express')
const coinsController = require('../controllers/coinsControllers')

const router = express.Router()

// ROUTER coins
router.route('/coins').get(coinsController.getCoinsListMeta)

module.exports = router
