import axios from 'axios'

const port = process.env.VUE_APP_DEFAULT_BACKEND_PORT

const api = {
  getPulls (year) {
    return axios.get(`http://localhost:${port}/api/v1/pulls/${year}`)
  }
}

export default api
