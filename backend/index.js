const express = require('express')
const router = require('./api/router')

const app = express()

app.use('/api/v1', router)

const port = 8001

app.listen(port, () =>
  console.log(`backend service listening at port ${port}`)
)
