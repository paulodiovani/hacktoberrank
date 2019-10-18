import cron from '../../../backend/cron'
import axios from 'axios'
import mockedResponse from '../support/response.json'
import addedData from '../support/addedData.json'
import PullRequest from '../../../backend/services/PullRequest'

jest.mock('axios')

jest.mock('ioredis', () => {
  const Redis = require('ioredis-mock')
  if (typeof Redis === 'object') {
    // the first mock is an ioredis shim because ioredis-mock depends on it
    // https://github.com/stipsan/ioredis-mock/blob/master/src/index.js#L101-L111
    return {
      Command: { _transformer: { argument: {}, reply: {} } }
    }
  }
  // second mock for our code
  return function (...args) {
    return new Redis(args)
  }
})

const startDate = '2019-10-01 00:00:00'
const endDate = '2019-10-31 23:59:59'
const year = new Date(startDate).getFullYear()

describe('Script Cron that deals with redis', () => {
  let redisClient

  beforeAll(async () => {
    axios.get.mockResolvedValue({ data: mockedResponse })

    redisClient = await cron(startDate, endDate)
  })

  describe('Initially adds ', () => {
    it('adds 8 users to users:2019', async () => {
      const users = await redisClient.zrevrange(`users:${year}`, 0, -1)

      expect(users.length).toBe(8)
    })

    it('adds 8 pullrequests:2019:* that correspond to 8 users', async () => {
      const pullRequests = await redisClient.keys(`pull-requests:${year}:*`)

      expect(pullRequests.length).toBe(8)
    })

    it('has correct latest timestamp', async () => {
      const latestTimestamp = await redisClient.get('latest_timestamp')

      const mockedLatestTimestamp =
        mockedResponse.items[mockedResponse.items.length - 1].created_at

      expect(latestTimestamp).toBe(mockedLatestTimestamp)
    })

    it('has matching scores and user pull requests to recieved github response',
      async () => {
        axios.get.mockResolvedValue({ data: mockedResponse })

        const pullRequest = new PullRequest()

        const pullRequestList = (await pullRequest.getAll())
          .groupByUser()
          .sortByMostActive()
          .getData()

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

        const truthArray = []
        arrOfObjects.forEach((obj) => {
          pullRequestList.forEach((pr) => {
            if (obj.username === pr.username &&
              compareTwoArraysNoOrder(obj.pullRequests, pr.pullRequests)) {
              truthArray.push(true)
            }
          })
        })

        expect(truthArray.filter(Boolean).length).toBe(arrOfObjects.length)
      })
  })

  describe('add more data by making another request', () => {
    const pullRequest = new PullRequest()
    let oldRedisUserAndScoresList
    let pullRequestList

    beforeAll(async () => {
      axios.get.mockResolvedValue({ data: addedData })

      oldRedisUserAndScoresList = await redisClient.zrevrange(`users:${year}`, 0, -1, 'WITHSCORES')

      redisClient = await cron(startDate, endDate)

      pullRequestList = (await pullRequest.getAll())
        .groupByUser()
        .sortByMostActive()
        .getData()
    })

    // This is because I want to use ${year} in the test description
    // eslint-disable-next-line
    it('adds the new users to users:${year} correctly', async () => {
      const users = await redisClient.zrevrange(`users:${year}`, 0, -1)

      const truthArray = []

      pullRequestList.forEach((pr) => {
        users.forEach((user) => {
          truthArray.push(pr.username === user)
        })
      })

      expect(truthArray.filter(Boolean).length).toBe(pullRequestList.length)
    })

    it('updates user scores according to new data correctly', async () => {
      const newUsers = await redisClient.zrevrange(`users:${year}`, 0, -1, 'WITHSCORES')

      const truthArray = []
      pullRequestList.forEach((pr) => {
        const indexOfUserInUsers = newUsers.indexOf(pr.username)
        if (indexOfUserInUsers >= 0) {
          const score = newUsers[indexOfUserInUsers + 1]
          const addedScore = pr.pullRequests.length

          const indexOfUserInOldUsers = oldRedisUserAndScoresList.indexOf(pr.username)
          if (indexOfUserInOldUsers >= 0) {
            const oldScore = oldRedisUserAndScoresList[indexOfUserInOldUsers + 1]

            const T = (oldScore + addedScore) === score

            truthArray.push(T)
          } else {
            const T = addedScore === score

            truthArray.push(T)
          }
        } else {
          truthArray.push(false)
        }
      })

      expect(truthArray.filter(Boolean).length).toBe(pullRequestList.length)
    })

    it('has user scores matching their number of pull requests', async () => {
      const users = await redisClient.zrevrange(`users:${year}`, 0, -1, 'WITHSCORES')

      const promises = []
      const orderedScoreList = []
      for (let i = 0; i < users.length; i += 2) {
        let username = users[i]
        let score = users[i + 1]

        orderedScoreList.push(score)

        promises.push(
          redisClient.smembers(`pull-requests:${year}:${username}`)
        )
      }

      let pullRequestsArrayOflinks = await Promise.all(promises)

      pullRequestsArrayOflinks = pullRequestsArrayOflinks.reduce((prev, curr) => {
        if (typeof prev[0] === 'string') {
          return [prev.length, curr.length]
        }

        return [...prev, curr.length]
      })

      expect(pullRequestsArrayOflinks.toString() === orderedScoreList.toString()).toBe(true)
    })
  })
})

function compareTwoArraysNoOrder (arr1, arr2) {
  const truthArray = []
  arr1.forEach((ele) => {
    arr2.forEach((ele2) => {
      truthArray.push(ele === ele2)
    })
  })

  if (arr1.length === truthArray.filter(Boolean).length) { return true }

  return false
}
