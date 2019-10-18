const express = require('express')
const cors = require('cors')
const router = require('./api/router')

const app = express()

app.use('/api/v1', cors(), router)

const port = 8001

app.listen(port, () =>
  console.log(`backend service listening at port ${port}`)
)
