const mongoose = require('mongoose')

const MAX_GUESSES = 5

// data will pass through the schema before being saved to the database
const userSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true,
    },
    playStreak: {
        type: Number,
        default: 0, // 1 create on Connect/Payment
    },
    winStreak: {
        type: Number,
        default: 0, // 1 create on Connect/Payment
    },
    games: [
        {
            gameNum: {
                type: Number, // retrieved and fed from SC
                unique: true,
            },
            isPaid: {
                type: Boolean,
            },
            guesses: {
                type: [String],
                default: [], // update on each guess
                validate: [
                    (guesses) => guesses.length <= MAX_GUESSES,
                    `Maximum number of guesses is ${MAX_GUESSES}.`,
                ],
            },
            isWin: {
                type: Boolean,
                default: false, // update on submit win
            },
            isWinSubmitted: {
                type: Boolean,
                default: false, // update on submit win
            },
            isLose: {
                type: Boolean,
                default: false, // is max guesses exceeded
            },
        },
    ],
})

// create a model from the schema
const User = mongoose.model('User', userSchema)

module.exports = User
