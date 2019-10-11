const axios = require('axios')

let pEndpoint = (year) => {
  return `https://api.github.com/search/issues?q=is:pr created:${year}-10-01..${year}-10-31&sort=created&order=desc`
}

class PullRequest {
  constructor (year) {
    this.data = {}
    this.year = year || (new Date()).getFullYear()
  }

  /**
   * Retrieves all pull requests (github limits them to 100)
   */
  async getAll () {
    try {
      let response = await axios.get(pEndpoint(this.year))

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

    this.data = prArray

    return this
  }

  /**
   * Sort grouped data by user who has most pull requests
   */
  sortByMostActive () {
    this.data = this.data.sort((a, b) => {
      return a.pullRequests.length > b.pullRequests.length ? -1 : 1
    })

    return this
  }
}

module.exports = PullRequest
