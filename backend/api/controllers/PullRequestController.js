const express = require('express')
const PullRequest = require('../../services/PullRequest')
const redisClient = require('../../redis')

const PullRequestController = express()

PullRequestController.get('/:year?', async function (req, res) {
  let response = {}
  const year = req.params.year || (new Date()).getFullYear()
  let pullRequest = new PullRequest(year)

  try {
    const users = await redisClient.exists(`users:${year}`)

    if (users === 0) {
      response = await pullRequest.getAll()

      response
        .groupByUser()
        .sortByMostActive()

      let arrayOfOrderedUsers = []
      let data = response.data
      let promises = []

      for (let i = 0; i < data.length; i++) {
        let username = data[i].username
        let score = data[i].pullRequests.length
        let pullRequests = data[i].pullRequests

        promises[i] = redisClient.sadd(`pull-requests:${year}:${username}`, pullRequests)
        arrayOfOrderedUsers.push(score, username)
      }

      await Promise.all(promises)
      await redisClient.zadd(`users:${year}`, arrayOfOrderedUsers)

      res.json(response.data)
    } else {
      let users = await redisClient.zrevrange(`users:${year}`, 0, -1)
      let arrOfObjects = []
      let promises = []

      for (let i = 0; i < users.length; i++) {
        promises[i] = redisClient.smembers(`pull-requests:${year}:${users[i]}`)
      }

      let result = await Promise.all(promises)
      for (let i = 0; i < users.length; i++) {
        arrOfObjects.push({
          username: users[i],
          pullRequests: result[i]
        })
      }
      res.json(arrOfObjects)
    }
  } catch (error) {
    res.status(400).send(error)
  }
})

module.exports = PullRequestController
