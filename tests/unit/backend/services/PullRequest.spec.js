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
    let res = {}

    beforeAll(async () => {
      axios.get.mockResolvedValue({ data: mockedResponse })

      try {
        res = await pr.getAll()
      } catch (error) {
        console.error(error)
      }
    })

    it('does exist', () => {
      expect(typeof pr.getAll === 'function').toBe(true)
    })

    it('gives a github response', () => {
      // total_count is always returned in a github api response
      expect(res.data['total_count']).not.toBe(undefined)
    })

    it('fills data property with github data', () => {
      expect(pr.data['total_count']).not.toBe(undefined)
    })
  })

  describe('method groupByUser', () => {
    let res = {}
    let testUsername
    let testPrUrl

    beforeAll(async () => {
      axios.get.mockResolvedValue({ data: mockedResponse })

      try {
        res = await pr.getAll()
      } catch (error) {
        console.error(error)
      }

      testUsername = res.data.items[0].user.login
      testPrUrl = res.data.items[0].html_url

      res.groupByUser()
    })

    it('does exist', () => {
      expect(typeof pr.groupByUser === 'function').toBe(true)
    })

    describe('returns an array', () => {
      it('is an array of objects', () => {
        expect(typeof res.data[0] === 'object').toBe(true)
      })
      it('has an object with a username ', () => {
        let user = res.data.find((obj) => {
          return obj.username === testUsername
        })

        expect(user).not.toBeUndefined()
      })

      it('and a child that is an array pull requests', () => {
        let user = res.data.find((obj) => {
          return obj.username === testUsername
        })

        expect(user.pullRequests[0] === testPrUrl).toBe(true)
      })
    })
  })

  describe('method sortByMostActive', () => {
    let res = {}
    beforeAll(async () => {
      axios.get.mockResolvedValue({ data: mockedResponse })

      try {
        res = await pr.getAll()
      } catch (error) {
        console.error(error)
      }

      res.groupByUser().sortByMostActive()
    })

    it('does exist', () => {
      expect(typeof pr.sortByMostActive === 'function').toBe(true)
    })

    it('has the first element with most number of pull requests', () => {
      let max = 0

      res.data.map((obj) => {
        max = obj.pullRequests.length > max ? obj.pullRequests.length : max
      })

      expect(res.data[0].pullRequests.length).toBe(max)
    })
  })
})
