const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = require('./app')

dotenv.config({ path: './.env' })
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)

mongoose
    .connect(DB, {
        userCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
    })
    .then((con) => {
        console.log(con.connection)
        console.log('DB connection successful')
    })

// data will pass through the schema before being saved to the database
const coinSchema = new mongoose.Schema({
    // cmc_rank: {
    //     type: Number,
    //     required: [true, 'A coin must have a rank'],
    //     // unique: true,
    //     // default: 0,
    // },
    cmc_rank: Number,
    name: String,
    symbol: String,
    date_added: String,
    max_supply: Number,
    price: Number,
    marketCap: Number,
})

// create a model from the schema
const Coin = mongoose.model('Coin', coinSchema)

// create a new instance of the model
const testCoin = new Coin({
    cmc_rank: 998,
    name: 'TestCoin2',
    symbol: 'TEST2',
    date_added: '2013-04-28T00:00:00.000Z',
    max_supply: 21000001,
    price: 10001,
    marketCap: 100000001,
})

// save the instance to the database
testCoin
    .save()
    .then((docCoin) => {
        console.log(docCoin)
    })
    .catch((error) => {
        console.log(error)
    })

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})
