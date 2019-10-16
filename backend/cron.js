const CronJob = require('cron').CronJob
const PullRequest = require('./services/PullRequest')
const redisClient = require('./redis')

const year = 2019

async function runCrons () {
  const newjob = new CronJob('* * * * *', async () => {
    try {
      let pullRequest = new PullRequest(year)

      let response = await pullRequest.getAll()

      response
        .groupByUser()
        .sortByMostActive()

      let data = response.data

      let prsPromises = []

      for (let pr in data) {
        prsPromises.push(
          redisClient.sadd(`pull-requests:${year}:${data[pr].username}`, data[pr].pullRequests)
        )
      }

      let addedPullsRef = await Promise.all(prsPromises)

      let userList = await redisClient.zrevrange(`users:${year}`, 0, -1, 'WITHSCORES')
      let dataKeys = Object.keys(data)

      if (userList.length) {
      // if db already had users, then
        for (let pr in data) {
          for (let i = 0; i < userList.length; i = i + 2) {
            if (data[pr].username === userList[i]) {
              userList[i + 1] = parseInt(userList[i + 1]) + addedPullsRef[pr]
            }

            // because zrevrange gives back the users and their scores swapped
            // only runs in the last loop of the outer loop (pr in data)
            if (dataKeys[dataKeys.length - 1] === pr) {
              let temp

              temp = userList[i]
              userList[i] = userList[i + 1]
              userList[i + 1] = temp
            }
          }
        }

        await redisClient.zadd(`users:${year}`, userList)
      } else {
      // initial case where there is no users
        let arrayOfOrderedUsers = []

        for (let i = 0; i < data.length; i++) {
          arrayOfOrderedUsers.push(data[i].pullRequests.length, data[i].username)
        }

        await redisClient.zadd(`users:${year}`, arrayOfOrderedUsers)
      }
    } catch (error) {
      console.log(error)
    }
  }, null, true, process.env.Timezone ? process.env.Timezone : 'America/Los_Angeles')

  return [
    newjob
  ]
}

module.exports = runCrons
