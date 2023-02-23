const express = require('express')
const coinsController = require('../controllers/coinsControllers')

const router = express.Router()

// CUSTOM MIDDLEWARE
// .params for req, .param for router
router.param('id', coinsController.checkID)

// ROUTER coins
router
    .route('/')
    .get(coinsController.getAllCoins)
    .post(coinsController.checkBody, coinsController.createCoin) // multicheck (note order)
router
    .route('/:id')
    .get(coinsController.getSingleCoin)
    .patch(coinsController.updateCoin)
    .delete(coinsController.deleteCoin)

module.exports = router
