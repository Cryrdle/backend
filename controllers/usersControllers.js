const User = require('../models/usersModel')

const MAX_GUESSES = 5
// const GAMETODAY = req.body.GAMETODAY
const WINNING_COIN = 'BTC'

//---- ENDPOINT = ../users/

// GET all users
exports.getAllUsers = async (req, res) => {
    console.log('Trying to get all users...')
    try {
        const allUsers = await User.find()
        res.status(200).json({
            status: 'success',
            requestTime: req.requestTime,
            data: {
                users: allUsers,
            },
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        })
    }
}
// POST new user
exports.createUser = async (req, res) => {
    console.log('Trying to create brand new user...')
    try {
        const user = new User({
            address: req.body.address,
        })
        await user.save()
        res.status(201).json({
            status: 'success',
            message: 'address log created',
            requestTime: req.requestTime,
            data: {
                user: user,
            },
        })
    } catch (err) {
        console.error(err)
        res.status(500).json({
            status: 'Internal server error',
            message: err.message,
        })
    }
}

//---- ENDPOINT = ../users/:address

// GET Single User
exports.getSingleUser = (req, res) => {
    User.findOne({ address: req.params.address }, (err, doc) => {
        if (err) {
            res.status(500).json({
                message: 'Error getting user',
                error: err,
            })
        } else if (!doc) {
            res.status(404).json({
                status: 'fail',
                message: 'address not found..',
            })
        } else {
            res.status(200).send(doc)
        }
    })
}

// PATCH Single User (update)

// TODO updates play streak
// TODO updates win streak
// updates isPaid
// updates gameNum
// updates guesses
// TODO updates adds isWon
// TODO decide on CONNECT vs on PAYMENT
exports.updateUser = (req, res) => {
    User.findOne({ address: req.params.address }, (err, doc) => {
        //--perform normal address checks
        if (err) {
            res.status(500).json({
                message: 'Error getting user',
                error: err,
            })
        } else if (!doc) {
            res.status(404).json({
                status: 'fail',
                message: 'address not found..',
            })
        }

        //--check whether paid today
        const todayGameIndex = doc.games.findIndex((el) => {
            return el.gameNum === req.body.GAMETODAY
        })

        const todayGame = doc.games[todayGameIndex]
        const newGuess = req.body.guess

        if (todayGameIndex !== -1) {
            // There is at least one game with a gameNum that matches GAMETODAY

            // guess input errors
            if (!newGuess) {
                res.status(204).json({
                    status: 'fail',
                    message: 'no guess included',
                    data: {
                        gameNum: todayGame.gameNum,
                        guesses: todayGame.guesses,
                    },
                })
            } else if (todayGame.guesses.includes(newGuess)) {
                res.status(400).json({
                    status: 'fail',
                    message: 'already guessed this coin',
                    data: {
                        gameNum: todayGame.gameNum,
                        guess: req.body.guess,
                        guesses: todayGame.guesses,
                    },
                })
            } else if (todayGame.guesses.length >= MAX_GUESSES) {
                //this needs to be moved one guess earlier + refactor this bit to use isLose
                todayGame.isLose = true
                doc.winStreak = 0

                res.status(400).json({
                    status: 'fail',
                    message: 'max guesses reached',
                    data: {
                        gameNum: todayGame.gameNum,
                        guess: req.body.guess,
                        guesses: todayGame.guesses,
                        isLose: todayGame.true,
                    },
                })
            }

            guesses = todayGame.guesses.push(newGuess)

            // check if guess is correct
            if (newGuess === WINNING_COIN) {
                todayGame.isWin = true
                doc.winStreak += 1
            }

            doc.save()
            res.status(200).json({
                status: 'success',
                message: 'guesses updated',
                data: {
                    gameNum: todayGame.gameNum,
                    guess: req.body.guess,
                    guesses: todayGame.guesses,
                },
            })
        } else {
            // There is no game with a gameNum that matches GAMETODAY
            console.log('payment received, adding game:')
            // increment playStreak
            doc.playStreak += 1
            // add new gameNum
            doc.games.push({
                gameNum: req.body.gameNum,
                guesses: [],
                isPaid: true,
                isWin: false,
                isWinSubmitted: false,
                isLose: false,
            })
            doc.save()
            res.status(200).json({
                status: 'success',
                message: 'paid status updated',
                data: doc,
            })
        }
    })
}

/**
 * TODO
 * how to best pass GAMETODAY and WINNING COIN to the controller?
 *
 *
 *
 */
