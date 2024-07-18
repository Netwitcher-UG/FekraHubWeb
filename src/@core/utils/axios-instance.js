import axios from 'axios'

const api = axios.create({
  baseURL: process.env.BACK_END_URL
})

//   bro remoo > fro   rresponse interceptor
api.interceptors.response.use(
  response => response,
  error => {
    console.error(error.response)
    if (error.response && error.response.status === 401) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export default api
