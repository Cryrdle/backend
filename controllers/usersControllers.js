const fs = require('fs')

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../data/cryrdle-users.json`)
)

//---USERS ROUTING---//
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
exports.getSingleUser = (req, res) => {
    const id = req.params.id * 1
    const user = users.find((el) => el.id === id)

    console.log(user)

    // when first user is index 0
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
