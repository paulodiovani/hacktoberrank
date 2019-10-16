const CronJob = require('cron').CronJob
const PullRequest = require('./services/PullRequest')
const redisClient = require('./redis')

let startDate = '2019-10-01 00:00:00'
const endDate = '2019-10-31 23:59:59'
const year = new Date(startDate).getFullYear()

async function runCrons () {
  const updatePullRequests = new CronJob('*/5 * * * *', async () => {
    try {
      let latestTimestampInRedis = await redisClient.get('latest_timestamp')

      if (latestTimestampInRedis) {
        startDate = latestTimestampInRedis
      }

      let pullRequest = new PullRequest(startDate, endDate)

      let response = await pullRequest.getAll()

      let latestTimestamp = response.latestTimestamp()
      await redisClient.set('latest_timestamp', latestTimestamp)

      response
        .groupByUser()
        .sortByMostActive()

      let data = response.data
      let prsPromises = []

      data.forEach((pr) => {
        prsPromises.push(
          redisClient.sadd(`pull-requests:${year}:${pr.username}`, pr.pullRequests)
        )
      })

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

        data.forEach((user) => {
          const score = user.pullRequests.length
          arrayOfOrderedUsers.push(score, user.username)
        })

        await redisClient.zadd(`users:${year}`, arrayOfOrderedUsers)
      }
    } catch (error) {
      console.log(error)
    }
  }, null, true, process.env.Timezone ? process.env.Timezone : 'America/Los_Angeles')

  return [
    updatePullRequests
  ]
}

module.exports = runCrons
