const express = require('express')
const router = require('./api/router')
const runCrons = require('./cron')

const app = express()

app.use('/api/v1', router)

runCrons()

const port = 8002

app.listen(port, () =>
  console.log(`backend service listening at port ${port}`)
)
