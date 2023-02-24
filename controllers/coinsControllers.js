const axios = require('axios')

// set number of coins to retrieve
NUMBER_OF_COINS = 5
NUMBER_OF_META = NUMBER_OF_COINS

exports.getCoinsListMeta = async (req, res) => {
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

        res.json(coinData) // Send the extracted data back to the client
    } catch (error) {
        console.error(error)
        res.status(500).send('Error retrieving coin data')
    }
}
