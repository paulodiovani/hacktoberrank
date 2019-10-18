const express = require('express')
const cors = require('cors')
const router = require('./api/router')
const path = require('path')

require('dotenv').config();

const app = express()

app.use('/', express.static(path.join(__dirname, '../dist')))

app.use('/api/v1', cors(), router)

const port = process.env.DEFAULT_BACKEND_PORT

app.listen(port, () =>
  console.log(`backend service listening at port ${port}`)
)
