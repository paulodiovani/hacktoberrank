import PullRequestController from '../../../../backend/api/controllers/PullRequestController'
import axios from 'axios'
import mockedResponse from '../../support/response.json'
import fetchPullRequests from '../../../../backend/workers/fetch-pull-requests'
import addedData from '../../support/addedData.json'
import PullRequest from '../../../../backend/services/PullRequest'

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

describe('PullRequestController that deals with redis', () => {
  let redisClient

  beforeAll(async () => {
    axios.get.mockResolvedValue({ data: mockedResponse })

    redisClient = await fetchPullRequests(startDate, endDate)
    
    res = []
  })

  describe('gets PR ', () => {
    it('gets PR from users:2019 that are not bots', async () => {
      PullRequestController.get("2019", res)

      expect(res.length).toBe(10)
    })
  })
})

