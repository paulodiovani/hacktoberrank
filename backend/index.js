require('dotenv').config();

const express = require('express')
const cors = require('cors')
const path = require('path')

const router = require('./api/router')
const debug = require('debug')('index')

const app = express()

app.use('/', express.static(path.join(__dirname, '../dist')))

app.use('/api/v1', cors(), router)

const port = process.env.PORT

app.listen(port, () =>
  debug(`backend service listening at port ${port}`)
)
