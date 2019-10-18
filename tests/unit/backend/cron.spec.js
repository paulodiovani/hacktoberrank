import cron from '../../../backend/cron'
import axios from 'axios'
import mockedResponse from '../support/response.json'

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

describe('Script Cron that updates redis', () => {
  let redisClient;

  beforeAll(async () => {
    axios.get.mockResolvedValue({ data: mockedResponse })

    redisClient = await cron(startDate, endDate)
  })

  it('adds 8 users to users:2019', async () => {
    const users = await redisClient.zrevrange(`users:${year}`, 0, -1)

    expect(users.length).toBe(8)
  })

  it('adds 8 pullrequests:2019:* that correspond to 8 users', async () => {
    const pullRequests = await redisClient.keys(`pull-requests:${year}:*`)

    expect(pullRequests.length).toBe(8)
  })


  // check how many pull-requests
  // check format of pull requests
  // check latest_timestamp
  // check for users to have matching data between response.json and redis
})
