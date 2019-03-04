import axios from 'axios'
import qs from 'qs'
import { catchCode, catchError } from "../common/js/util";
import {baseUrl} from "../common/js/config"

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 60000,
  withCredentials: true
})

// instance.defaults.headers.post['Content-Type'] = 'application/json'

instance.interceptors.request.use(config => {
  config.data = qs.stringify(config.data)
  return config
}, err => {
  console.log(err)
})

instance.interceptors.response.use(response => {
  if (response.data.statusCode === 200) {
    return response.data.data
  } else {
    catchCode(response.data.statusCode, response.data.msg)
    return 'isError'
  }
},catchError)

export default instance
