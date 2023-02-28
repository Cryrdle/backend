const axios = require('axios')
const Coin = require('../models/coinsModel')

// set number of coins to retrieve
NUMBER_OF_COINS = 70
NUMBER_OF_META = NUMBER_OF_COINS

// get coin data from coinmarketcap
exports.getCoinsList = async (req, res) => {
    const MY_CMC_API_KEY = process.env.CMC_API_KEY
    const listingUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=${NUMBER_OF_COINS}&convert=USD`
    const infoUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/info'
    try {
        const listingResponse = await axios.get(listingUrl, {
            headers: {
                'X-CMC_PRO_API_KEY': MY_CMC_API_KEY,
            },
        })
        const myListingResponse = listingResponse.data.data.map((coin) => {
            return {
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                date_added: coin.date_added,
                max_supply: coin.max_supply,
                cmc_rank: coin.cmc_rank,
                price: coin.quote.USD.price,
                marketCap: coin.quote.USD.market_cap,
                volume24h: coin.quote.USD.volume_24h,
            }
        })

        //---------- SPLIT AND RETRIEVE METADATA ----------
        const topCoins = myListingResponse.slice(0, NUMBER_OF_META)
        const ids_array = topCoins.map((coin) => coin.id)
        const ids = topCoins.map((coin) => coin.id).join()

        const infoResponse = await axios.get(infoUrl, {
            headers: {
                'X-CMC_PRO_API_KEY': MY_CMC_API_KEY,
            },
            params: {
                id: ids, // pass to info endpoint
            },
        })
        const myInfoResponse = ids_array.map((id) => {
            return {
                coin: infoResponse.data.data[id],
                category: infoResponse.data.data[id].category,
                description: infoResponse.data.data[id].description,
                logo: infoResponse.data.data[id].logo,
                tags: infoResponse.data.data[id].tags,
                website: infoResponse.data.data[id].urls,
            }
        })

        // Merge the two responses based on the `id` field
        const coinData = topCoins.map((coin) => {
            const id = coin.id
            const fullmeta = myInfoResponse.find((item) => item.coin.id === id)
            const metadata = {
                category: fullmeta.category,
                description: fullmeta.description,
                logo: fullmeta.logo,
                tags: fullmeta.tags,
                // website: fullmeta.urls.website[0],
            }
            return { ...coin, ...metadata }
        })

        // clear prev coins list from MongoDB Cloud
        await Coin.deleteMany({})
        console.log('Coin list cleared from database')

        // Save new coins list to MongoDB Cloud
        await Coin.insertMany(coinData)
        console.log('Coin data saved to database')

        // res.json(coinData) // Send the extracted data back to the client
        res.status(200).json({
            status: 'success',
            requestTime: req.requestTime,
            results: coinData.length.length,
            data: coinData,
        })
    } catch (error) {
        console.error(error)
        res.status(500).send('Error retrieving coin data')
    }
}

// get single coin data from mongo database
exports.getSingleCoin = async (req, res) => {
    Coin.findOne({ symbol: req.params.symbol }, (err, doc) => {
        if (err) {
            res.status(500).json({
                message: 'Error getting coin',
                error: err,
            })
        } else if (!doc) {
            res.status(404).json({
                status: 'fail',
                message: 'Invalid ID..',
            })
        } else {
            res.status(200).send(doc)
        }
    })
}
// get single coin by index
exports.getWinnerCoin = async (req, res) => {
    const id = req.params.cmc_rank * 1
    Coin.findOne({ cmc_rank: id }, (err, doc) => {
        if (err) {
            res.status(500).json({
                message: 'Error getting coin',
                error: err,
            })
        } else if (!doc) {
            res.status(404).json({
                status: 'fail!',
                message: 'Invalid ID!',
                id: id,
            })
        } else {
            res.status(200).send(doc)
        }
    })
}

// 1. Get coins from CMC once per day
// ---- make the request in coinsController
// ---- do not need to pass to client
// 2. Immediately after save coins to database
// ---- use the mongo.create to store that info in the database
// 3. Compare user's guesses to coins in database
// ---- use mongo.find to get the info from the database upon each user guess
// 4. Get data on user's guesses from database
// ---- add each guess to a user's (daily) guesses
// ---- use mongo.find to get the info from the database upon
// ---- for each user guess
