const express = require('express')
const PullRequest = require('../../services/PullRequest')

const PullRequestController = express()

PullRequestController.get('/:year?', async function (req, res) {
  let response = {}
  let pullRequest = new PullRequest(req.params.year)

  try {
    response = await pullRequest.getAll()

    response
      .groupByUser()
      .sortByMostActive()

    res.send(response.data)
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = PullRequestController
