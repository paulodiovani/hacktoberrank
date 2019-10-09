const express = require('express');
const PullRequest = require('../../services/PullRequest');

const PullRequestController = express();

PullRequestController.get('/', async function (req, res) {
    let response = {};
    let pullRequest = new PullRequest();

    try {
        response = await pullRequest.getAll();
        
        response.groupByUserId()
                .sortByMostActive()

    } catch (error) {
        res.status(400).send(error)
    }

    res.send(response);

})

module.exports = PullRequestController;