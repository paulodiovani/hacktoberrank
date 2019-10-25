const express = require('express')
const redisClient = require('../../redis')

const PullRequestController = express()

PullRequestController.get('/:year?', async function (req, res) {
  const year = req.params.year || (new Date()).getFullYear()

  try {
    const users = await redisClient.zrevrange(`users:${year}`, 0, -1)
    const promises = []
    let arrOfObjects = []
    
    const nonBotUsers = users.filter((user) => {
      return !user.endsWith("[bot]")
    })

    for (let i = 0; i < nonBotUsers.length; i++) {
      promises[i] = redisClient.smembers(`pull-requests:${year}:${nonBotUsers[i]}`)
    }

    const result = await Promise.all(promises)
    for (let i = 0; i < nonBotUsers.length; i++) {
      arrOfObjects.push({
        username: nonBotUsers[i],
        pullRequests: result[i]
      })
    }
    res.json(arrOfObjects)
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = PullRequestController
