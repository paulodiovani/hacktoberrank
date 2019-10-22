import PullRequest from '../../../../backend/services/PullRequest'
import axios from 'axios'
import mockedResponse from '../../support/response.json'

jest.mock('axios')

describe('PullRequest service', () => {
  let pr = {}

  beforeAll(() => {
    pr = new PullRequest()
  })

  it('initializes an empty object', () => {
    expect(typeof pr === 'object').toBe(true)
  })

  it('has an empty data property', () => {
    expect(pr).toHaveProperty('data', {})
  })

  describe('method getAll', () => {
    beforeAll(async () => {
      axios.get.mockResolvedValue({ data: mockedResponse })

      try {
        await pr.getAll()
      } catch (error) {
        return error
        // console.error(error)
      }
    })

    it('does exist', () => {
      expect(typeof pr.getAll === 'function').toBe(true)
    })

    it('gives a github response', () => {
      // total_count is always returned in a github api response
      expect(pr.data['total_count']).not.toBe(undefined)
    })

    it('fills data property with github data', () => {
      expect(pr.data['total_count']).not.toBe(undefined)
    })
  })

  describe('method groupByUser', () => {
    let testUsername
    let testPrUrl

    beforeAll(async () => {
      testUsername = pr.data.items[0].user.login
      testPrUrl = pr.data.items[0].html_url

      pr.groupByUser()
    })

    it('does exist', () => {
      expect(typeof pr.groupByUser === 'function').toBe(true)
    })

    describe('returns an array', () => {
      it('is an array of objects', () => {
        expect(typeof pr.chainData[0] === 'object').toBe(true)
      })
      it('has an object with a username ', () => {
        const user = pr.chainData.find((obj) => {
          return obj.username === testUsername
        })

        expect(user).not.toBeUndefined()
      })

      it('and a child that is an array pull requests', () => {
        const user = pr.chainData.find((obj) => {
          return obj.username === testUsername
        })

        expect(user.pullRequests[0] === testPrUrl).toBe(true)
      })
    })
  })

  describe('method sortByMostActive', () => {
    beforeAll(async () => {
      pr.sortByMostActive()
    })

    it('does exist', () => {
      expect(typeof pr.sortByMostActive === 'function').toBe(true)
    })

    it('has the first element with most number of pull requests', () => {
      let max = 0

      pr.chainData.forEach((obj) => {
        max = obj.pullRequests.length > max ? obj.pullRequests.length : max
      })

      expect(pr.chainData[0].pullRequests.length).toBe(max)
    })
  })

  describe('method getData', () => {
    beforeAll(async () => {
      pr.getData()
    })

    it('does exist', () => {
      expect(typeof pr.getData === 'function').toBe(true)
    })

    it('returns chainData', () => {
      expect(pr.hasOwnProperty('chainData')).toBe(true)
    })
  })

  describe('method latestTimestamp', () => {
    it('returns latest timestamp', () => {
      const latestDate = pr.data.items[pr.data.items.length - 1].created_at
      expect(pr.latestTimestamp()).toBe(latestDate)
    })
  })
})
