const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const app = require('./app')

dotenv.config({ path: './.env' })
const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)

// connect to the database
mongoose
    .connect(DB, {
        userCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
    })
    .then((con) => {
        console.log('DB connection successful')
    })

const port = process.env.PORT || 3999

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})
