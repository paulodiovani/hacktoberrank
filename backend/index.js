const express = require('express')
const cors = require('cors')
const router = require('./api/router')
const debug = require('debug')('index')

const app = express()

app.use('/api/v1', cors(), router)

const port = 8001

app.listen(port, () =>
  debug(`backend service listening at port ${port}`)
)
