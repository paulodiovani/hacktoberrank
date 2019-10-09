const axios = require('axios')

let pEndpoint = (year) => {
  return `https://api.github.com/search/issues?q=is:pr created:${year}-10-01..${year}-10-31&sort=created&order=desc`
}

class PullRequest {
  constructor (year) {
    this.data = {}
    this.year = year || (new Date()).getFullYear();
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
      throw new Error(error)
    }
  }

  /**
   * Group pull requests by user id
   */
  groupByUserId () {
    let groupedData = {}
    let data = this.data

    for (let item in data.items) {
      if (groupedData[data.items[item].user.id]) {
        groupedData[data.items[item].user.id].push(data.items[item].html_url)
      } else {
        groupedData[data.items[item].user.id] = [data.items[item].html_url]
      }
    }

    this.data = groupedData

    return this
  }
  /**
   * Sort grouped data by user who has most pull requests
   */
  sortByMostActive () {
    let newArray = []
    let groupedData = this.data

    // convert to array as they are sortable
    for (let key in groupedData) {
      newArray.push([key, groupedData[key]])
    }

    newArray.sort((a, b) => (a[1].length < b[1].length ? 1 : -1))

    this.data = newArray

    return this
  }
}

module.exports = PullRequest
