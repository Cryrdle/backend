const dotenv = require('dotenv')
const app = require('./app')

dotenv.config({ path: './.env' })
// console.log(process.env)

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})