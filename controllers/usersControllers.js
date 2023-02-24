const fs = require('fs')

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/cryrdle-users.json`)
)

exports.checkBody = (req, res, next) => {
    if (!req.body.address) {
        return res.status(400).json({
            status: 'fail',
            message: 'address is required',
        })
    }
    next()
}

/**
 * getAllUsers...
 * -- may not be required depending on
 *    smart contract implementation
 */
exports.getAllUsers = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime,
        results: users.length,
        data: {
            users: users,
        },
    })
}

/**
 * getSingleUser shall...
 * -- primarily be used to get user's daily guesses
 *    prior to them being submitted on-chain. This
 *    will affect the frontend state upon signin
 */
exports.getSingleUser = (req, res) => {
    const id = req.params.id * 1
    const user = users.find((el) => el.id === id)

    if (id > users.length - 1) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        })
    }
    res.status(200).json({
        status: 'success',
        data: {
            user: user,
        },
    })
}

/**
 * createUser shall...
 * -- create account for newly recognised addresses (on payment)
 * -- require an address
 *
 * create user may...
 * -- set todayPaid to true or false
 */
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'success',
        message: 'Internal server error',
    })
}

/**
 * update user shall...
 * -- update users' daily guesses as they are made
 * -- clear daily guesses when new daily coin is chosen
 *
 * update user may...
 * -- update username
 * -- update if paid today
 * -- update daily streak
 */
exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'success',
        message: 'Internal server error',
    })
}

/**
 * delete user is currently not required
 */
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'success',
        message: 'Internal server error',
    })
}
