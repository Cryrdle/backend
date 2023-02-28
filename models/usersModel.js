const mongoose = require('mongoose')

const MAX_GUESSES = 10

// data will pass through the schema before being saved to the database
const userSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    streak: {
        type: Number,
        required: true,
        default: 0,
    },
    data: {
        type: Map,
        of: {
            date: Date,
            paid: {
                type: Boolean,
                default: false,
            },
            guesses: {
                type: [String],
                default: [],
                validate: [
                    (guesses) => guesses.length <= MAX_GUESSES,
                    'Maximum number of guesses is 5',
                ],
            },
        },
        default: {},
    },
})

// create a model from the schema
const User = mongoose.model('User', userSchema)

module.exports = User
