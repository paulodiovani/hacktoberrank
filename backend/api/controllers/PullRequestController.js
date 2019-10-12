const express = require('express')
const PullRequest = require('../../services/PullRequest')
const redisClient = require('../../redis')

const PullRequestController = express()

PullRequestController.get('/:year?', async function (req, res) {
  let response = {}
  let year = req.params.year
  let pullRequest = new PullRequest(year)

  redisClient.exists('users')
    .then(async (users) => {
      if (users === 0) {
        try {
          response = await pullRequest.getAll()

          response
            .groupByUser()
            .sortByMostActive()

          let arrayOfOrderedUsers = []
          let data = response.data

          for (let i = 0; i < data.length; i++) {
            await redisClient.rpush(`pull-requests:${year}:${data[i].username}`,
              data[i].pullRequests)
            arrayOfOrderedUsers.push(data[i].pullRequests.length, data[i].username)
          }

          await redisClient.zadd('users', arrayOfOrderedUsers)

          res.json(response.data)
        } catch (error) {
          res.status(400).send(error)
        }
      } else {
        try {
          let users = await redisClient.zrevrange('users', 0, -1)
          let arrOfObjects = []

          for (let i = 0; i < users.length; i++) {
            let result = await redisClient.lrange(`pull-requests:${year}:${users[i]}`, 0, -1)
            arrOfObjects.push({
              username: users[i],
              pullRequests: result
            })
          }

          res.json(arrOfObjects)
        } catch (error) {
          console.error(error)
        }
      }
    })
    .catch((error) => {
      if (error) {
        console.error(error)
      }
    })
})

module.exports = PullRequestController
