try {
  require('dotenv').config();
} catch (error) {
  console.warn('Cannot load dotenv', error.message)
}

const express = require('express')
const cors = require('cors')
const path = require('path')

const router = require('./api/router')

const app = express()

app.use('/', express.static(path.join(__dirname, '../dist')))

app.use('/api/v1', cors(), router)

const port = process.env.PORT

app.listen(port, () =>
  console.log(`backend service listening at port ${port}`)
)
