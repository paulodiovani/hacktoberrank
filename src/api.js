import axios from 'axios'

const api = {
  getPulls (year) {
    return axios.get(`http://localhost:8001/api/v1/pulls/${year}`)
  }
}

export default api
