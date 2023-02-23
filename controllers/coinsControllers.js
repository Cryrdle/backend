const fs = require('fs')

// const users = JSON.parse(
//     fs.readFileSync(`${__dirname}/../data/cryrdle-users.json`)
// )

// .params for req
exports.checkID = (req, res, next, val) => {
    console.log(`Coin id is: ${val}`)
    if (req.params.id * 1 > coins.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }
    next()
}

// checkBody for req
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price',
        })
    }
    next()
}

exports.getAllCoins = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime,
        results: coins.length,
        data: {
            coins: coins,
        },
    })
}
exports.createCoin = (req, res) => {
    const newId = coins[coins.length - 1].id + 1
    const newCoin = Object.assign({ id: newId }, req.body)

    coins.push(newCoin)

    fs.writeFile(
        `${__dirname}/data/nft-simple.json`,
        JSON.stringify(coins),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    nft: newCoin,
                },
            })
        }
    )
}
exports.getSingleCoin = (req, res) => {
    const id = req.params.id * 1
    const nft = coins.find((el) => el.id === id)

    if (id > coins.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            nft: nft,
        },
    })
}
exports.updateCoin = (req, res) => {
    if (req.params.id * 1 > coins.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            nft: '<Updating Coin here...>',
        },
    })
}
exports.deleteCoin = (req, res) => {
    if (req.params.id * 1 > coins.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }
    res.status(404).json({
        status: 'success',
        data: null,
    })
}
