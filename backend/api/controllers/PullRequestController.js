const express = require('express')
const redisClient = require('../../redis')

const PullRequestController = express()

PullRequestController.get('/:year?', async function (req, res) {
  const year = req.params.year || (new Date()).getFullYear()

  try {
    const users = await redisClient.zrevrange(`users:${year}`, 0, -1)
    const promises = []
    let arrOfObjects = []

    for (let i = 0; i < users.length; i++) {
      promises[i] = redisClient.smembers(`pull-requests:${year}:${users[i]}`)
    }

    const result = await Promise.all(promises)
    for (let i = 0; i < users.length; i++) {
      arrOfObjects.push({
        username: users[i],
        pullRequests: result[i]
      })
    }
    res.json(arrOfObjects)
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = PullRequestController
