const debug = require('debug')('index')

try {
  require('dotenv').config()
} catch (e) {
  debug(e)
}

const express = require('express')
const cors = require('cors')
const path = require('path')

const router = require('./api/router')

const app = express()

app.use('/', express.static(path.join(__dirname, '../dist')))

app.use('/api/v1', cors(), router)

const port = process.env.PORT || 8001

app.listen(port, () =>
  debug(`backend service listening at port ${port}`)
)
