const express = require('express')
const coinsController = require('../controllers/coinsControllers')

const router = express.Router()

// ROUTER coins

// GET /coins from CMC
router.route('/coins').get(coinsController.getCoinsList)

// GET single coins from CMC by symbol from DB
router
    .route('/coins/:cmc_rank')
    .get(coinsController.getSingleCoin, coinsController.getWinnerCoin)

// GET single coins from CMC by symbol from DB
// router.route('/coins/:symbol').get(coinsController.getSingleCoin)

module.exports = router
