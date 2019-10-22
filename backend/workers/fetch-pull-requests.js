const PullRequest = require('../services/PullRequest')
const redisClient = require('../redis')

// command line: nodejs cron.js startDate endDate
const args = process.argv.slice(2) || []

const startDate = args[0] || '2019-10-01 00:00:00'
const endDate = args[1] || '2019-10-31 23:59:59'

const JEST_MODE = process.env.JEST_WORKER_ID !== undefined

async function runCron (startDate, endDate) {
  const year = new Date(startDate).getFullYear()

  try {
    const latestTimestampInRedis = await redisClient.get('latest_timestamp')

    if (latestTimestampInRedis) {
      startDate = latestTimestampInRedis
    }

    const pullRequest = new PullRequest(startDate, endDate)
    const pullRequestList = (await pullRequest.getAll())
      .groupByUser()
      .sortByMostActive()
      .getData()

    const latestTimestamp = pullRequest.latestTimestamp()
    await redisClient.set('latest_timestamp', latestTimestamp)

    const prsPromises = []

    pullRequestList.forEach((pr) => {
      prsPromises.push(
        redisClient.sadd(`pull-requests:${year}:${pr.username}`, pr.pullRequests)
      )
    })

    const addedPullsRef = await Promise.all(prsPromises)

    const usersAndScores = await redisClient.zrevrange(`users:${year}`, 0, -1, 'WITHSCORES')

    if (usersAndScores.length) {
    // if db already had users, then
      for (const pr in pullRequestList) {
        const nameIndex = usersAndScores.indexOf(pullRequestList[pr].username)
        if (nameIndex >= 0) {
          const scoreIndex = nameIndex + 1
          usersAndScores[scoreIndex] = parseInt(usersAndScores[scoreIndex]) + addedPullsRef[pr]
        } else {
          usersAndScores.push(
            pullRequestList[pr].username,
            addedPullsRef[pr]
          )
        }
      }

      usersAndScores.reverse()

      await redisClient.zadd(`users:${year}`, usersAndScores)
    } else {
      // initial case where there is no users
      const arrayOfOrderedUsers = []

      pullRequestList.forEach((user) => {
        const score = user.pullRequests.length
        arrayOfOrderedUsers.push(score, user.username)
      })

      await redisClient.zadd(`users:${year}`, arrayOfOrderedUsers)
    }

    if (!JEST_MODE) {
      process.exit()
    }

    return redisClient
  } catch (error) {
    // console.log(error)
    if (!JEST_MODE) {
      process.exit()
    }

    return redisClient
  }
}

if (!JEST_MODE) {
  runCron(startDate, endDate)
}

module.exports = runCron
