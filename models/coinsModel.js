const mongoose = require('mongoose')

// data will pass through the schema before being saved to the database
const coinSchema = new mongoose.Schema({
    id: Number,
    name: String,
    symbol: String,
    date_added: String,
    max_supply: Number,
    cmc_rank: Number,
    price: Number,
    marketCap: Number,
    volume24h: Number,
    category: String,
    description: String,
    logo: String,
    tags: Array,
})

// create a model from the schema
const Coin = mongoose.model('Coin', coinSchema)

module.exports = Coin
