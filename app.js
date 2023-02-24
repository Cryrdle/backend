const express = require('express')
const morgan = require('morgan')

//--INTERNAL IMPORT
const coinsRouter = require('./routes/coinsRoute')
const usersRouter = require('./routes/usersRoute')

const app = express()
app.use(express.json())

const dotenv = require('dotenv')
dotenv.config({ path: './.env' }) // needed for .env

// only log in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// SERVING (STATIC) TEMPLATE, IMAGE, ETC FILES using express.static
// app.use(express.static(`${__dirname}/img`))

// MIDDLEWARE TO ADD TIME TO REQUEST
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

app.use('/', coinsRouter)
app.use('/api/v1/users', usersRouter)

module.exports = app
