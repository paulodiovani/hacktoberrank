const express = require('express');

const router = express();


const PullRequestController = require('./controllers/PullRequestController')
router.use('/pull-requests', PullRequestController)


module.exports = router;