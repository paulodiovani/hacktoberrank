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

  describe('method groupByUserId', () => {
    let res = {}
    let testUserId
    let testPrUrl

    beforeAll(async () => {
      axios.get.mockResolvedValue({ data: mockedResponse })

      try {
        res = await pr.getAll()
      } catch (error) {
        console.error(error)
      }

      testUserId = res.data.items[0].user.id
      testPrUrl = res.data.items[0].html_url

      res.groupByUserId()
    })

    it('does exist', () => {
      expect(typeof pr.groupByUserId === 'function').toBe(true)
    })

    it(`returns an object that 
            has a user id and a child that is a pull request`, () => {
      expect(res.data[testUserId].indexOf(testPrUrl) >= 0).toBe(true)
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

      res.groupByUserId().sortByMostActive()
    })

    it('does exist', () => {
      expect(typeof pr.sortByMostActive === 'function').toBe(true)
    })

    it('has the first element with most number of pull requests', () => {
      let max = 0
      res.data.map((val, key) => {
        max = val[1].length > max ? val[1].length : max
      })

      expect(res.data[0][1].length).toBe(max)
    })
  })
})
