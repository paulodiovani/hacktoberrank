const axios = require('axios')

let pEndpoint = (startDate, endDate) => {
  return `https://api.github.com/search/issues?q=is:pr created:${startDate}..${endDate}&sort=created&order=asc`
}

class PullRequest {
  constructor (startDate, endDate) {
    this.data = {}
    this.chainData = {}
    this.startDate = startDate || '2019-10-01 00:00:00'
    this.endDate = endDate || '2019-10-31 23:59:59'
  }

  /**
   * Retrieves all pull requests (github limits them to 100)
   */
  async getAll () {
    try {
      let response = await axios.get(pEndpoint(this.startDate, this.endDate))

      this.data = response.data

      return this
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Group pull requests by user id
   */
  groupByUser () {
    let prArray = []

    this.data.items.forEach((item) => {
      let user = prArray.find((ele) => {
        return ele.username === item.user.login
      })

      if (user) {
        user.pullRequests.push(item.html_url)
      } else {
        prArray.push({
          username: item.user.login,
          pullRequests: [
            item.html_url
          ]
        })
      }
    })

    this.chainData = prArray

    return this
  }

  /**
   * Sort grouped data by user who has most pull requests
   */
  sortByMostActive () {
    this.chainData = this.chainData.sort((a, b) => {
      return a.pullRequests.length > b.pullRequests.length ? -1 : 1
    })

    return this
  }

  /**
   * Data property getter
   */
  getData () {
    return this.chainData
  }

  /**
   * Returns the latest timestamp
   */
  latestTimestamp () {
    return this.data.items[this.data.items.length - 1].created_at
  }
}

module.exports = PullRequest
