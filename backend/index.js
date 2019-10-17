require('dotenv').config()
const express = require('express')
const cors = require('cors')

const router = require('./api/router')

const app = express()

app.use('/api/v1', cors(), router)
app.use(express.static(`${__dirname}/../dist`));

const port = process.env.PORT || process.env.DEFAULTPORT

app.listen(port, () =>
  console.log(`backend service listening at port ${port}`)
)
