import axios from 'axios'

const api = {
  getPulls (year, pagination) {
    return axios.get(`http://localhost:8001/api/v1/pulls/${year}`, {
      params: {
        ...pagination
      }
    })
  }
}

export default api
