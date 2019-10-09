const express = require('express')

const router = express()

const PullRequestController = require('./controllers/PullRequestController')
router.use('/pulls', PullRequestController)

module.exports = router
